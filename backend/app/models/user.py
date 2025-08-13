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

        if is_new and self.is_active:
            # 新規アクティブユーザーの場合、ランキングを作成
            Ranking.objects.create(user=self, ranking=1)
        elif not is_new:
            # 既存ユーザーの場合、以下の条件でランキングを更新
            should_update_rankings = False

            # ゴールドが変更された場合
            if hasattr(self, "_old_gold") and self._old_gold != self.gold:
                should_update_rankings = True
                logger.info(
                    f"ユーザー {self.id} のゴールドが変更: {self._old_gold} → {self.gold}"
                )

            # is_activeが変更された場合
            if (
                hasattr(self, "_old_is_active")
                and self._old_is_active != self.is_active
            ):
                should_update_rankings = True
                logger.info(
                    f"ユーザー {self.id} のis_activeが変更: {self._old_is_active} → {self.is_active}"
                )

            # ランキング更新が必要な場合
            if should_update_rankings:
                logger.info(f"ユーザー {self.id} の変更によりランキングを更新")
                User.update_rankings()

    @classmethod
    def update_rankings(cls):
        """アクティブユーザーのランキングを更新"""
        users = cls.objects.filter(is_active=True).order_by("-gold")
        for index, user in enumerate(users):
            Ranking.objects.filter(user=user).update(ranking=index + 1)

    def delete(self, *args, **kwargs):
        """ユーザー削除時にランキングを再計算"""
        logger.info(f"ユーザー {self.id} を削除し、ランキングを更新")
        super().delete(*args, **kwargs)
        # 削除後にランキングを再計算
        User.update_rankings()

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
