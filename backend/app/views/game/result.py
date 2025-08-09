from typing import Dict, Optional
from app.models import User, Game
from django.db.models import Sum, Count
import graphene
import logging
from graphene_django.types import DjangoObjectType
from app.utils.constants import ResultErrorMessages
from app.utils.errors import BaseError
from typing import List

logger = logging.getLogger("app")


class ResultError(BaseError):
    """結果に関するエラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        code: str = "RESULT_ERROR",
        details: Optional[List[str]] = None,
    ):
        super().__init__(
            message=message,
            code=code,
            status=400,
            details=details,
        )


class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = ("id", "user", "bet_amount", "score", "gold_change", "created_at")


class GameResultType(graphene.ObjectType):
    """ゲーム結果のGraphQL型定義"""

    current_gold = graphene.Int()
    bet_amount = graphene.Int()
    loss_amount = graphene.Int()
    gold_change = graphene.Int()
    current_rank = graphene.Int()
    rank_change = graphene.Int()
    next_rank_gold = graphene.Int()


class GameResult:
    def __init__(self, user: User, game: Game):
        self.user = user
        self.game = game
        logger.info(f"ゲーム結果初期化: user_id={user.id}, game_id={game.id}")

    def get_result(self) -> Dict:
        try:
            logger.info(
                f"ゲーム結果取得開始: user_id={self.user.id}, game_id={self.game.id}"
            )

            # 現在の所持金
            current_gold = self.user.gold
            logger.info(f"現在の所持金: {current_gold}")

            # 掛け金
            bet_amount = self.game.bet_amount
            logger.info(f"掛け金: {bet_amount}")

            # 倍率分の損失額（gold_changeがマイナスの場合）
            loss_amount = abs(self.game.gold_change) if self.game.gold_change < 0 else 0
            logger.info(f"損失額: {loss_amount}")

            # 現在のランキング
            current_rank = self._get_current_rank()
            logger.info(f"現在のランキング: {current_rank}")

            # ランキングの変動
            rank_change = self._get_rank_change()
            logger.info(f"ランキング変動: {rank_change}")

            # 次のランキングまでの必要金額
            next_rank_gold = self._get_next_rank_gold()
            logger.info(f"次のランクまでの必要金額: {next_rank_gold}")

            result = {
                "current_gold": current_gold,
                "bet_amount": bet_amount,
                "loss_amount": loss_amount,
                "gold_change": self.game.gold_change,
                "current_rank": current_rank,
                "rank_change": rank_change,
                "next_rank_gold": next_rank_gold,
            }
            logger.info(
                f"ゲーム結果取得完了: user_id={self.user.id}, game_id={self.game.id}"
            )
            return result

        except Exception as e:
            logger.error(f"結果取得エラー: {str(e)}", exc_info=True)
            raise ResultError(
                message=ResultErrorMessages.RANKING_CALCULATION_ERROR,
                details=[str(e)],
            )

    def _get_current_rank(self) -> int:
        logger.info(f"現在のランキング取得開始: user_id={self.user.id}")
        try:
            rank = (
                User.objects.filter(gold__gt=self.user.gold)
                .values("gold")
                .annotate(count=Count("id"))
                .aggregate(total=Sum("count"))["total"]
                or 0
            )
            current_rank = rank + 1
            logger.info(
                f"現在のランキング取得完了: user_id={self.user.id}, rank={current_rank}"
            )
            return current_rank
        except Exception as e:
            logger.error(
                f"ランキング取得エラー: user_id={self.user.id}, error={str(e)}",
                exc_info=True,
            )
            raise ResultError(
                message=ResultErrorMessages.RANKING_CALCULATION_ERROR,
                details=[str(e)],
            )

    def _get_rank_change(self) -> int:
        logger.info(f"ランキング変動取得開始: user_id={self.user.id}")
        try:
            # 前回の所持金
            previous_gold = self.user.gold - self.game.gold_change
            logger.info(f"前回の所持金: {previous_gold}")

            # 前回のランキングを取得
            previous_rank = (
                User.objects.filter(gold__gt=previous_gold)
                .values("gold")
                .annotate(count=Count("id"))
                .aggregate(total=Sum("count"))["total"]
                or 0
            )
            previous_rank += 1
            logger.info(f"前回のランキング: {previous_rank}")

            # 現在のランキング
            current_rank = self._get_current_rank()
            logger.info(f"現在のランキング: {current_rank}")

            # ランキングの変動を計算
            rank_change = previous_rank - current_rank
            logger.info(f"ランキング変動計算完了: {rank_change}")
            return rank_change
        except Exception as e:
            logger.error(
                f"ランキング変動取得エラー: user_id={self.user.id}, error={str(e)}",
                exc_info=True,
            )
            raise ResultError(
                message=ResultErrorMessages.RANK_CHANGE_CALCULATION_ERROR,
                details=[str(e)],
            )

    def _get_next_rank_gold(self) -> Optional[int]:
        logger.info(f"次のランク必要金額取得開始: user_id={self.user.id}")
        try:
            next_rank_user = (
                User.objects.filter(gold__gt=self.user.gold).order_by("gold").first()
            )
            if next_rank_user:
                next_rank_gold = next_rank_user.gold - self.user.gold
                logger.info(f"次のランク必要金額: {next_rank_gold}")
                return next_rank_gold
            logger.info("1位のため次のランク必要金額なし")
            return None
        except Exception as e:
            logger.error(
                f"次のランク必要金額取得エラー: user_id={self.user.id}, error={str(e)}",
                exc_info=True,
            )
            raise ResultError(
                message=ResultErrorMessages.NEXT_RANK_CALCULATION_ERROR,
                details=[str(e)],
            )
