import uuid
from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.conf import settings


class PasswordReset(models.Model):
    """パスワードリセット用のワンタイムトークン"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_resets",
    )
    token = models.CharField(max_length=255, unique=True, null=False)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "password_resets"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["token"]),
            models.Index(fields=["user", "is_used"]),
        ]

    def __str__(self) -> str:
        return f"PasswordReset for {self.user.email}"

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    def use(self) -> None:
        """トークンを使用済みにする。
        期限切れは別で判定する。
        """
        self.is_used = True
        self.used_at = timezone.now()
        self.save()

    @classmethod
    def create_for_user(cls, user, expiration_hours: int = 1):
        """ユーザー用のリセットトークンを作成。
        既存の未使用トークンは無効化する。
        """
        cls.objects.filter(user=user, is_used=False).update(
            is_used=True, used_at=timezone.now()
        )

        token = str(uuid.uuid4())
        expires_at = timezone.now() + timedelta(hours=expiration_hours)
        return cls.objects.create(user=user, token=token, expires_at=expires_at)

    @classmethod
    def get_valid_token(cls, token: str):
        """有効な（未使用かつ未期限切れ）トークンを取得"""
        try:
            pr = cls.objects.get(token=token, is_used=False)
            if pr.is_expired:
                return None
            return pr
        except cls.DoesNotExist:
            return None
