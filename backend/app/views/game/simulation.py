from graphene import Mutation, String, Int, Boolean, List
from django.db import transaction
import logging
from app.models import Game
import graphene
from app.utils.validators import GameValidator
from app.utils.game_calculator import GameCalculator
from django.core.exceptions import ValidationError

logger = logging.getLogger("app")


class CompletePractice(Mutation):
    class Arguments:
        correct_typed = graphene.Int(required=True)
        accuracy = graphene.Float(required=True)

    success = Boolean()
    errors = List(String)
    score = Int()
    gold_change = Int()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, correct_typed, accuracy):
        try:
            user = info.context.user
            logger.info(
                f"練習完了処理開始: user_id={user.id if user.is_authenticated else '未認証'}"
            )

            # バリデーション
            GameValidator.validate_correct_typed(correct_typed)
            GameValidator.validate_accuracy(accuracy)
            logger.info("バリデーション成功")

            # スコア計算
            score = GameCalculator.calculate_score(correct_typed, accuracy)
            logger.info(f"スコア計算: score={score}")

            # 過去のスコアを取得してZスコアを計算
            past_scores = list(Game.objects.values_list("score", flat=True))
            if past_scores:
                z_score = GameCalculator.calculate_z_score(score, past_scores)
                logger.info(f"Zスコア計算: z_score={z_score}")

                # 倍率の計算
                multiplier = GameCalculator.calculate_multiplier(z_score)
                logger.info(f"倍率計算: multiplier={multiplier}")

                # 固定の掛け金400で計算
                fixed_bet = 400
                gold_change = GameCalculator.calculate_gold_change(
                    multiplier, fixed_bet, user.gold if user.is_authenticated else None
                )
                logger.info(f"ゴールド変化計算: gold_change={gold_change}")

                # ログインユーザーの場合
                if user.is_authenticated:
                    # 所持金が0の場合
                    if user.gold == 0:
                        logger.info(f"所持金0のため100ゴールド付与: user_id={user.id}")
                        user.gold += 100
                        user.save()
                        logger.info(
                            f"ゴールド付与完了: user_id={user.id}, new_gold={user.gold}"
                        )
                        return CompletePractice(
                            success=True, errors=[], score=score, gold_change=100
                        )

                    return CompletePractice(
                        success=True, errors=[], score=score, gold_change=gold_change
                    )

                # 未ログインユーザーの場合
                return CompletePractice(
                    success=True, errors=[], score=score, gold_change=gold_change
                )

            # 過去のスコアがない場合はスコアのみ返却
            logger.info("過去のスコアがないためスコアのみ返却")
            return CompletePractice(success=True, errors=[], score=score, gold_change=0)

        except ValidationError as e:
            logger.warning(f"バリデーションエラー: {str(e)}")
            return CompletePractice(success=False, errors=[str(e)])
        except Exception as e:
            logger.error(
                f"練習完了処理エラー: user_id={user.id if user.is_authenticated else '未認証'}, error={str(e)}",
                exc_info=True,
            )
            return CompletePractice(
                success=False, errors=[str(e)], score=0, gold_change=0
            )
