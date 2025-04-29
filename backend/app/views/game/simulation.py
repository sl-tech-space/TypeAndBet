from graphene import Mutation, String, Int, Boolean, List
from django.db import transaction
import logging

logger = logging.getLogger("app")


class CompletePractice(Mutation):
    success = Boolean()
    errors = List(String)
    gold_change = Int()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info):
        try:
            user = info.context.user
            logger.info(
                f"練習完了処理開始: user_id={user.id if user.is_authenticated else '未認証'}"
            )

            if not user.is_authenticated:
                logger.warning("未認証ユーザーのアクセス")
                return CompletePractice(success=True, errors=[], gold_change=0)

            # 所持金が0の場合のみ120を付与
            if user.gold == 0:
                logger.info(f"所持金0のため120ゴールド付与: user_id={user.id}")
                user.gold += 120
                user.save()
                logger.info(
                    f"ゴールド付与完了: user_id={user.id}, new_gold={user.gold}"
                )
                return CompletePractice(success=True, errors=[], gold_change=120)

            logger.info(
                f"所持金があるため付与なし: user_id={user.id}, current_gold={user.gold}"
            )
            return CompletePractice(success=True, errors=[], gold_change=0)

        except Exception as e:
            logger.error(
                f"練習完了処理エラー: user_id={user.id if user.is_authenticated else '未認証'}, error={str(e)}",
                exc_info=True,
            )
            return CompletePractice(success=False, errors=[str(e)], gold_change=0)
