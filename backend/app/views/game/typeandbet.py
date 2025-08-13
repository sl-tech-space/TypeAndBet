import logging

import graphene
from django.core.exceptions import ValidationError
from django.db import transaction
from graphene_django.types import DjangoObjectType

from app.models import Game, Ranking
from app.utils.constants import GameErrorMessages
from app.utils.game_calculator import GameCalculator
from app.utils.sanitizer import sanitize_string
from app.utils.validators import GameValidator

logger = logging.getLogger("app")


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = ("id", "user", "bet_gold", "score", "score_gold_change", "created_at")


class CreateBet(graphene.Mutation):
    """新しいベット（ゲーム）を作成するミューテーション"""

    class Arguments:
        bet_gold = graphene.Int(required=True)

    class CreateBetGameType(graphene.ObjectType):
        id = graphene.UUID()
        bet_gold = graphene.Int()
        created_at = graphene.DateTime()

    game = graphene.Field(CreateBetGameType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, bet_gold):
        try:
            # 数値は基本GraphQLで型制約されるが念のため文字列から来た場合を考慮
            if isinstance(bet_gold, str):
                bet_gold = sanitize_string(bet_gold)
                bet_gold = int(bet_gold) if bet_gold.isdigit() else -1
            logger.info(f"掛け金設定開始: bet_gold={bet_gold}")

            # ユーザー情報の取得
            user = info.context.user
            if not user.is_authenticated:
                logger.warning("未認証ユーザーのアクセス")
                raise ValidationError(GameErrorMessages.LOGIN_REQUIRED)
            logger.info(f"ユーザー情報取得: user_id={user.id}")
            logger.info(f"現在の所持金: {user.gold}")

            # バリデーション
            GameValidator.validate_bet_amount(bet_gold)
            GameValidator.validate_user_gold(user.gold, bet_gold)
            logger.info("バリデーション成功")

            # ゲームレコードの作成（ベット前残高をスナップショット）
            game = Game.objects.create(
                user=user,
                bet_gold=bet_gold,
                score=0,
                before_bet_gold=user.gold,
            )
            logger.info(f"ゲームレコード作成: game_id={game.id}")

            # ユーザーの所持金を更新
            user.gold -= bet_gold
            user.save()
            logger.info(f"所持金更新: new_gold={user.gold}")

            # 出力は必要最小限のみ返却
            return CreateBet(
                game=CreateBet.CreateBetGameType(
                    id=game.id, bet_gold=game.bet_gold, created_at=game.created_at
                ),
                success=True,
                errors=[],
            )

        except ValidationError as e:
            logger.warning(f"バリデーションエラー: {str(e)}")
            return CreateBet(success=False, errors=[str(e)])
        except Exception as e:
            logger.error(f"掛け金設定エラー: {str(e)}", exc_info=True)
            return CreateBet(
                success=False,
                errors=[f"{GameErrorMessages.BET_SETTING_ERROR}: {str(e)}"],
            )


class UpdateGameScore(graphene.Mutation):
    """ゲームのスコアを更新し、結果に基づいてゴールドを増減するミューテーション"""

    class Arguments:
        game_id = graphene.UUID(required=True)
        correct_typed = graphene.Int(required=True)
        accuracy = graphene.Float(required=True)

    game = graphene.Field(GameType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, game_id, correct_typed, accuracy):
        try:
            # 文字列で来た場合のサニタイジングと安全変換
            if isinstance(game_id, str):
                game_id = sanitize_string(game_id)
            if isinstance(correct_typed, str):
                raw = sanitize_string(correct_typed)
                correct_typed = int(raw) if raw.isdigit() else -1
            if isinstance(accuracy, str):
                raw = sanitize_string(accuracy)
                try:
                    accuracy = float(raw)
                except Exception:
                    accuracy = -1

            logger.info(
                f"スコア更新開始: game_id={game_id}, correct_typed={correct_typed}, accuracy={accuracy}"
            )

            # ユーザー情報の取得
            user = info.context.user
            if not user.is_authenticated:
                logger.warning("未認証ユーザーのアクセス")
                raise ValidationError(GameErrorMessages.LOGIN_REQUIRED)
            logger.info(f"ユーザー情報取得: user_id={user.id}")

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
                raise ValidationError(GameErrorMessages.NO_PERMISSION)

            # スコア計算
            score = GameCalculator.calculate_score(correct_typed, accuracy)
            logger.info(f"スコア計算: score={score}")

            # 過去のスコアを取得してZスコアを計算
            past_scores = list(
                Game.objects.exclude(id=game_id)
                .filter(score__gt=0)
                .values_list("score", flat=True)
            )
            if past_scores:
                z_score = GameCalculator.calculate_z_score(score, past_scores)
                logger.info(f"Zスコア計算: z_score={z_score}")
            else:
                # データがない場合のデフォルトZスコアは0（倍率=1.0）
                z_score = 0.0
                logger.info("Zスコア計算: 過去データなしのため z_score=0.0")

            # 倍率の計算
            multiplier = GameCalculator.calculate_multiplier(z_score)
            logger.info(f"倍率計算: multiplier={multiplier}")

            # ゴールドの変化を計算
            gold_change = GameCalculator.calculate_gold_change(
                multiplier, game.bet_gold, user.gold
            )
            logger.info(f"ゴールド変化計算: gold_change={gold_change}")

            # ゲームの更新（スコア適用後の最終残高を保存）
            game.score = score
            game.score_gold_change = gold_change
            game.result_gold = game.before_bet_gold - game.bet_gold + gold_change
            game.save()
            logger.info(f"ゲーム更新: game_id={game.id}")

            # ユーザーの所持金を更新
            new_gold = user.gold + gold_change
            if new_gold < 0:
                logger.warning(f"所持金が負になるため0に制限: user_id={user.id}")
                user.gold = 0
            else:
                user.gold = new_gold
            user.save()
            logger.info(f"所持金更新: new_gold={user.gold}")

            # ランキングの更新（順位再計算をトリガ）
            ranking, _ = Ranking.objects.get_or_create(user=user)
            ranking.save()
            try:
                from app.models.user import User as UserModel

                UserModel.update_rankings()
                logger.info("ランキング一括更新完了")
            except Exception:
                # 失敗しても処理は継続
                logger.warning("ランキング一括更新に失敗しました")

            return UpdateGameScore(game=game, success=True, errors=[])

        except Game.DoesNotExist:
            logger.warning(f"ゲーム未検出: game_id={game_id}")
            return UpdateGameScore(
                success=False, errors=[GameErrorMessages.GAME_NOT_FOUND]
            )
        except ValidationError as e:
            logger.warning(f"バリデーションエラー: {str(e)}")
            return UpdateGameScore(success=False, errors=[str(e)])
        except Exception as e:
            logger.error(f"スコア更新エラー: {str(e)}", exc_info=True)
            return UpdateGameScore(
                success=False,
                errors=[f"{GameErrorMessages.SCORE_UPDATE_ERROR}: {str(e)}"],
            )
