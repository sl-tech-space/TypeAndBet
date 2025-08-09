import logging

import graphene
from django.core.exceptions import ValidationError
from django.db import transaction
from graphene_django.types import DjangoObjectType

from app.models import Game, Ranking
from app.utils.constants import GameErrorMessages
from app.utils.game_calculator import GameCalculator
from app.utils.validators import GameValidator
from app.utils.sanitizer import sanitize_string

logger = logging.getLogger("app")


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = ("id", "user", "bet_amount", "score", "gold_change", "created_at")


class CreateBet(graphene.Mutation):
    """新しいベット（ゲーム）を作成するミューテーション"""

    class Arguments:
        bet_amount = graphene.Int(required=True)

    game = graphene.Field(GameType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, bet_amount):
        try:
            # 数値は基本GraphQLで型制約されるが念のため文字列から来た場合を考慮
            if isinstance(bet_amount, str):
                bet_amount = sanitize_string(bet_amount)
                bet_amount = int(bet_amount) if bet_amount.isdigit() else -1
            logger.info(f"掛け金設定開始: bet_amount={bet_amount}")

            # ユーザー情報の取得
            user = info.context.user
            if not user.is_authenticated:
                logger.warning("未認証ユーザーのアクセス")
                raise ValidationError(GameErrorMessages.LOGIN_REQUIRED)
            logger.info(f"ユーザー情報取得: user_id={user.id}")
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
                Game.objects.exclude(id=game_id).values_list("score", flat=True)
            )
            if past_scores:
                z_score = GameCalculator.calculate_z_score(score, past_scores)
                logger.info(f"Zスコア計算: z_score={z_score}")

                # 倍率の計算
                multiplier = GameCalculator.calculate_multiplier(z_score)
                logger.info(f"倍率計算: multiplier={multiplier}")

                # ゴールドの変化を計算
                gold_change = GameCalculator.calculate_gold_change(
                    multiplier, game.bet_amount, user.gold
                )
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
