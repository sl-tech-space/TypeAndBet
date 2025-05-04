from graphene import Mutation, String, Int, Boolean, List
from django.db import transaction
import logging
import statistics
from app.models import Game
import graphene
from app.utils.validators import GameValidator
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
            score = int(correct_typed * 10 / accuracy)
            logger.info(f"スコア計算: score={score}")

            # 過去のスコアを取得してZスコアを計算
            past_scores = list(Game.objects.values_list("score", flat=True))
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

                # 固定の掛け金400で計算
                fixed_bet = 400
                if multiplier >= 0:
                    gold_change = int(fixed_bet * multiplier)
                else:
                    base_loss = int(fixed_bet * abs(multiplier))
                    additional_loss = int(fixed_bet * 0.1)
                    total_loss = base_loss + additional_loss
                    if user.is_authenticated and total_loss > user.gold:
                        total_loss = user.gold
                    gold_change = -total_loss
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
