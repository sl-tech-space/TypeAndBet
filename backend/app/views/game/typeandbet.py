import graphene
from graphene_django.types import DjangoObjectType
from django.db import transaction
from app.models import Game, Ranking
from django.core.exceptions import ValidationError
from app.validators.game_validator import GameValidator
import statistics
import logging

logger = logging.getLogger("app")


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = ("id", "user", "bet_amount", "score", "gold_change", "created_at")


def get_user(info):
    """ユーザー情報を取得するヘルパー関数"""
    user = info.context.user
    if not user.is_authenticated:
        logger.warning("未認証ユーザーのアクセス")
        raise ValidationError("ログインが必要です")
    logger.info(f"ユーザー情報取得: user_id={user.id}")
    return user


class CreateBet(graphene.Mutation):
    class Arguments:
        bet_amount = graphene.Int(required=True)

    game = graphene.Field(GameType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, bet_amount):
        try:
            logger.info(f"掛け金設定開始: bet_amount={bet_amount}")

            # ユーザー情報の取得
            user = get_user(info)
            logger.info(f"現在の所持金: {user.gold}")

            # バリデーション
            GameValidator.validate_bet_amount(bet_amount)
            GameValidator.validate_user_gold(user.gold, bet_amount)
            logger.info("バリデーション成功")

            # ゲームレコードの作成
            game = Game.objects.create(
                user=user, bet_amount=bet_amount, score=0, gold_change=-bet_amount
            )
            logger.info(f"ゲームレコード作成: game_id={game.id}")

            # ユーザーの所持金を更新
            user.gold -= bet_amount
            user.save()
            logger.info(f"所持金更新: new_gold={user.gold}")

            return CreateBet(game=game, success=True, errors=[])

        except ValidationError as e:
            logger.warning(f"バリデーションエラー: {str(e)}")
            return CreateBet(success=False, errors=[str(e)])
        except Exception as e:
            logger.error(f"掛け金設定エラー: {str(e)}", exc_info=True)
            return CreateBet(
                success=False,
                errors=[f"掛け金の設定中にエラーが発生しました: {str(e)}"],
            )


class UpdateGameScore(graphene.Mutation):
    class Arguments:
        game_id = graphene.UUID(required=True)
        correct_typed = graphene.Int(required=True)  # 正タイプ数
        accuracy = graphene.Float(required=True)  # 正タイプ率

    game = graphene.Field(GameType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, game_id, correct_typed, accuracy):
        try:
            logger.info(
                f"スコア更新開始: game_id={game_id}, correct_typed={correct_typed}, accuracy={accuracy}"
            )

            # ユーザー情報の取得
            user = get_user(info)

            # バリデーション
            GameValidator.validate_correct_typed(correct_typed)
            GameValidator.validate_accuracy(accuracy)
            logger.info("バリデーション成功")

            # ゲームの取得
            game = Game.objects.get(id=game_id)
            logger.info(f"ゲーム取得: game_id={game.id}")

            # ゲームの所有者チェック
            if game.user != user:
                logger.warning(
                    f"権限エラー: user_id={user.id}, game_user_id={game.user.id}"
                )
                raise ValidationError("このゲームを更新する権限がありません")

            # スコア計算
            score = int(correct_typed * 10 / accuracy)
            logger.info(f"スコア計算: score={score}")

            # 過去のスコアを取得してZスコアを計算
            past_scores = list(
                Game.objects.exclude(id=game_id).values_list("score", flat=True)
            )
            if past_scores:
                median = statistics.median(past_scores)
                std_dev = statistics.stdev(past_scores) if len(past_scores) > 1 else 1
                z_score = (score - median) / std_dev if std_dev != 0 else 0
                logger.info(f"Zスコア計算: z_score={z_score}")

                # 倍率の計算
                if z_score >= 3.0:
                    multiplier = 3.0  # 上位0.1%
                elif z_score >= 2.5:
                    multiplier = 2.5  # 上位0.6%
                elif z_score >= 2.0:
                    multiplier = 2.0  # 上位2.3%
                elif z_score >= 1.5:
                    multiplier = 1.75  # 上位6.7%
                elif z_score >= 1.0:
                    multiplier = 1.5  # 上位15.9%
                elif z_score >= 0.5:
                    multiplier = 1.25  # 上位30.9%
                elif z_score >= 0.0:
                    multiplier = 1.0  # 上位50%
                elif z_score >= -0.5:
                    multiplier = -1.0  # 下位30.9%
                elif z_score >= -1.0:
                    multiplier = -1.5  # 下位15.9%
                elif z_score >= -1.5:
                    multiplier = -2.0  # 下位6.7%
                elif z_score >= -2.0:
                    multiplier = -2.5  # 下位2.3%
                elif z_score >= -2.5:
                    multiplier = -3.0  # 下位0.6%
                else:
                    multiplier = -4.0  # 下位0.1%
                logger.info(f"倍率計算: multiplier={multiplier}")

                # ゴールドの変化を計算
                if multiplier >= 0:
                    gold_change = int(game.bet_amount * multiplier)
                else:
                    base_loss = int(game.bet_amount * abs(multiplier))
                    additional_loss = int(game.bet_amount * 0.1)
                    total_loss = base_loss + additional_loss
                    if total_loss > user.gold:
                        total_loss = user.gold
                    gold_change = -total_loss
                logger.info(f"ゴールド変化計算: gold_change={gold_change}")

                # ゲームの更新
                game.score = score
                game.gold_change = gold_change
                game.save()
                logger.info(f"ゲーム更新: game_id={game.id}")

                # ユーザーの所持金を更新
                user.gold += gold_change
                user.save()
                logger.info(f"所持金更新: new_gold={user.gold}")

                # ランキングの更新
                ranking, created = Ranking.objects.get_or_create(user=user)
                ranking.save()
                logger.info(f"ランキング更新: user_id={user.id}")

                return UpdateGameScore(game=game, success=True, errors=[])

        except Game.DoesNotExist:
            logger.warning(f"ゲーム未検出: game_id={game_id}")
            return UpdateGameScore(success=False, errors=["ゲームが見つかりません"])
        except ValidationError as e:
            logger.warning(f"バリデーションエラー: {str(e)}")
            return UpdateGameScore(success=False, errors=[str(e)])
        except Exception as e:
            logger.error(f"スコア更新エラー: {str(e)}", exc_info=True)
            return UpdateGameScore(
                success=False,
                errors=[f"スコアの更新中にエラーが発生しました: {str(e)}"],
            )
