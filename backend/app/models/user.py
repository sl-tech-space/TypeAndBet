import logging
import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from .managers import UserManager
from .ranking import Ranking

logger = logging.getLogger("app")


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=15, unique=True, null=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    icon = models.CharField(max_length=255, null=False, default="default.png")
    gold = models.IntegerField(default=1000, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        is_new = self._state.adding

        # 既存ユーザーの場合、変更前の値を保存
        if not is_new:
            try:
                old_instance = User.objects.get(pk=self.pk)
                self._old_gold = old_instance.gold
                self._old_is_active = old_instance.is_active
            except User.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        if not is_new:
            # ランキング処理
            if (
                hasattr(self, "_old_is_active")
                and self._old_is_active != self.is_active
                and self.is_active
            ):
                # is_activeがFalseからTrueに変更された場合
                self._handle_activation()
            elif (
                hasattr(self, "_old_gold")
                and self._old_gold != self.gold
                and self.is_active
            ):
                # アクティブユーザーのゴールドが変更された場合
                self._handle_gold_update()

    @classmethod
    def insert_user_ranking(cls, user):
        """新規ユーザーを適切なランキングに挿入"""
        # 1回のクエリで適切なランキングを計算
        new_ranking = cls.objects.filter(is_active=True, gold__gt=user.gold).count() + 1

        # ランキングレコードを作成
        ranking = Ranking.objects.create(user=user, ranking=new_ranking)

        # 下位のユーザーのランキングを1つずつ下げる
        cls._shift_rankings_down(new_ranking + 1)

        return ranking

    def _handle_activation(self):
        """ユーザーがアクティブになった時の処理"""
        # 既存のランキングレコードを確認（1回のクエリで判定）
        existing_ranking = Ranking.objects.filter(user=self).exists()

        if not existing_ranking:
            User.insert_user_ranking(self)

    def _handle_gold_update(self):
        """アクティブユーザーのゴールド更新時の処理"""
        User.update_user_ranking(self)

    @classmethod
    def update_user_ranking(cls, user):
        """特定ユーザーのランキングを更新"""
        try:
            # 現在のランキングを取得
            current_ranking = Ranking.objects.get(user=user)
            old_ranking = current_ranking.ranking

            # 新しいランキングを計算
            new_ranking = (
                cls.objects.filter(is_active=True, gold__gt=user.gold).count() + 1
            )

            # ランキングが変わった場合のみ更新
            if old_ranking != new_ranking:
                if new_ranking < old_ranking:
                    # 上位に移動した場合、下位のユーザーのランキングを1つずつ下げる
                    cls._shift_rankings_down(new_ranking + 1, old_ranking)
                else:
                    # 下位に移動した場合、上位のユーザーのランキングを1つずつ上げる
                    cls._shift_rankings_up(old_ranking, new_ranking - 1)

                # ユーザーのランキングを更新
                current_ranking.ranking = new_ranking
                current_ranking.save()
        except Ranking.DoesNotExist:
            # ランキングレコードが存在しない場合は新規作成
            cls.insert_user_ranking(user)

    @classmethod
    def _shift_rankings_down(cls, start_rank, end_rank=None):
        """指定された範囲のランキングを1つずつ下げる"""
        if end_rank is None:
            # 指定範囲以降のすべてのランキングを下げる
            rankings = Ranking.objects.filter(ranking__gte=start_rank).order_by(
                "ranking"
            )
        else:
            # 指定範囲のランキングを下げる
            rankings = Ranking.objects.filter(
                ranking__gte=start_rank, ranking__lte=end_rank
            ).order_by("ranking")

        for ranking in rankings:
            ranking.ranking += 1
            ranking.save()

    @classmethod
    def _shift_rankings_up(cls, start_rank, end_rank):
        """指定された範囲のランキングを1つずつ上げる"""
        rankings = Ranking.objects.filter(
            ranking__gte=start_rank, ranking__lte=end_rank
        ).order_by("-ranking")  # 降順で処理（上位から）

        for ranking in rankings:
            ranking.ranking -= 1
            ranking.save()

    class Meta:
        db_table = "users"
        ordering = ["id"]
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                condition=models.Q(is_active=True),
                name="unique_active_email",
            ),
            models.CheckConstraint(
                check=models.Q(gold__gte=0),
                name="gold_non_negative",
            ),
        ]
