import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from app.utils.constants import ModelConstants, RankingConstants


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=ModelConstants.MAX_NAME_LENGTH, unique=True, null=False
    )
    email = models.EmailField(
        max_length=ModelConstants.MAX_EMAIL_LENGTH, unique=True, null=False
    )
    icon = models.CharField(
        max_length=ModelConstants.MAX_ICON_LENGTH,
        null=False,
        default=ModelConstants.DEFAULT_ICON,
    )
    gold = models.IntegerField(default=ModelConstants.DEFAULT_GOLD, null=True)

    class Meta:
        db_table = "users"
        constraints = [
            models.CheckConstraint(
                check=models.Q(gold__gte=ModelConstants.MIN_GOLD),
                name="gold_non_negative",
            ),
        ]

    def __str__(self):
        return f"User {self.id}: {self.name}"

    @classmethod
    def update_rankings(cls):
        """
        全ユーザーのランキングを一括更新する
        この処理は重いため、定期的なバッチ処理での実行を推奨
        """
        from app.models.ranking import Ranking

        # アクティブユーザーのみを対象とする
        active_users = cls.objects.filter(is_active=True).order_by("-gold")

        # ランキングを一括更新
        for index, user in enumerate(
            active_users, start=RankingConstants.RANKING_START
        ):
            ranking, created = Ranking.objects.get_or_create(user=user)
            ranking.ranking = index
            ranking.save()

    @classmethod
    def update_user_ranking(cls, user):
        """
        特定ユーザーのランキングを更新する
        ユーザーのゴールドが変更された際に呼び出される
        """
        from app.models.ranking import Ranking

        # 1回のクエリで適切なランキングを計算
        new_ranking = (
            cls.objects.filter(is_active=True, gold__gt=user.gold).count()
            + RankingConstants.RANKING_START
        )

        # 既存のランキングレコードを確認（1回のクエリで判定）
        try:
            current_ranking = Ranking.objects.get(user=user)
            old_ranking = current_ranking.ranking

            if old_ranking != new_ranking:
                # 上位に移動した場合、下位のユーザーのランキングを1つずつ下げる
                cls._shift_rankings_down(
                    new_ranking + RankingConstants.RANKING_INCREMENT
                )
                # 下位に移動した場合、上位のユーザーのランキングを1つずつ上げる
                cls._shift_rankings_up(
                    old_ranking, new_ranking - RankingConstants.RANKING_DECREMENT
                )
                # 現在のユーザーのランキングを更新
                current_ranking.ranking = new_ranking
                current_ranking.save()

        except Ranking.DoesNotExist:
            # ランキングレコードが存在しない場合は新規作成
            (
                cls.objects.filter(is_active=True, gold__gt=user.gold).count()
                + RankingConstants.RANKING_START
            )
            # 上位に移動した場合、下位のユーザーのランキングを1つずつ下げる
            cls._shift_rankings_down(new_ranking + RankingConstants.RANKING_INCREMENT)
            # 下位に移動した場合、上位のユーザーのランキングを1つずつ上げる
            cls._shift_rankings_up(
                old_ranking, new_ranking - RankingConstants.RANKING_DECREMENT
            )
            # 新しいランキングレコードを作成
            Ranking.objects.create(user=user, ranking=new_ranking)

    @classmethod
    def _shift_rankings_down(cls, start_ranking):
        """指定された範囲のランキングを1つずつ下げる"""
        from app.models.ranking import Ranking

        # 指定されたランキング以上のユーザーを取得
        rankings_to_shift = Ranking.objects.filter(ranking__gte=start_ranking).order_by(
            "ranking"
        )

        # ランキングを1つずつ下げる
        for ranking in rankings_to_shift:
            ranking.ranking += RankingConstants.RANKING_INCREMENT
            ranking.save()

    @classmethod
    def _shift_rankings_up(cls, start_ranking, end_ranking):
        """指定された範囲のランキングを1つずつ上げる"""
        from app.models.ranking import Ranking

        # 指定された範囲のユーザーを取得
        rankings_to_shift = Ranking.objects.filter(
            ranking__gte=start_ranking, ranking__lte=end_ranking
        ).order_by("-ranking")

        # ランキングを1つずつ上げる
        for ranking in rankings_to_shift:
            ranking.ranking -= RankingConstants.RANKING_DECREMENT
            ranking.save()
