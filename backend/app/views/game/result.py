from typing import Dict, Optional
from app.models import User, Game
from django.db.models import F, Sum, Count
import graphene

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

    def get_result(self) -> Dict:
        """ゲーム結果を取得"""
        # 現在の所持金
        current_gold = self.user.gold

        # 掛け金
        bet_amount = self.game.bet_amount

        # 倍率分の損失額（gold_changeがマイナスの場合）
        loss_amount = abs(self.game.gold_change) if self.game.gold_change < 0 else 0

        # 現在のランキング
        current_rank = self._get_current_rank()

        # ランキングの変動
        rank_change = self._get_rank_change()

        # 次のランキングまでの必要金額
        next_rank_gold = self._get_next_rank_gold()

        return {
            'current_gold': current_gold,
            'bet_amount': bet_amount,
            'loss_amount': loss_amount,
            'gold_change': self.game.gold_change,
            'current_rank': current_rank,
            'rank_change': rank_change,
            'next_rank_gold': next_rank_gold
        }

    def _get_current_rank(self) -> int:
        """現在のランキングを取得"""
        # 所持金の降順でランキングを取得
        # 同点の場合は同じ順位になるように修正
        rank = User.objects.filter(
            gold__gt=self.user.gold
        ).values('gold').annotate(
            count=Count('id')
        ).aggregate(
            total=Sum('count')
        )['total'] or 0
        return rank + 1

    def _get_rank_change(self) -> int:
        """ランキングの変動を取得"""
        # 前回の所持金
        previous_gold = self.user.gold - self.game.gold_change

        # 前回のランキングを取得
        previous_rank = User.objects.filter(
            gold__gt=previous_gold
        ).values('gold').annotate(
            count=Count('id')
        ).aggregate(
            total=Sum('count')
        )['total'] or 0
        previous_rank += 1

        # 現在のランキング
        current_rank = self._get_current_rank()

        # ランキングの変動を計算（前回のランク - 現在のランク）
        return previous_rank - current_rank

    def _get_next_rank_gold(self) -> Optional[int]:
        """次のランキングまでの必要金額を取得"""
        # 現在のランキングより上のユーザーの中で最小の所持金を取得
        next_rank_user = User.objects.filter(gold__gt=self.user.gold).order_by('gold').first()
        if next_rank_user:
            return next_rank_user.gold - self.user.gold
        return None  # 1位の場合はNone