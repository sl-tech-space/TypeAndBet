import uuid
from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.conf import settings
from app.utils.tokens import generate_token, hash_token


class PasswordReset(models.Model):
    """パスワードリセット用のワンタイムトークン"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_resets",
    )
    # DBにはハッシュ化したトークンを保存する
    token_hash = models.CharField(max_length=64, unique=True, null=False)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "password_resets"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["token_hash"], name="idx_passwordreset_tokenhash"),
            models.Index(fields=["user", "is_used"]),
            models.Index(fields=["expires_at"], name="idx_passwordreset_expires"),
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

        raw_token = generate_token()
        token_hash = hash_token(raw_token)
        expires_at = timezone.now() + timedelta(hours=expiration_hours)
        instance = cls.objects.create(
            user=user, token_hash=token_hash, expires_at=expires_at
        )
        instance._raw_token = raw_token  # transient attribute for caller
        return instance

    @classmethod
    def get_valid_token(cls, token: str):
        """有効な（未使用かつ未期限切れ）トークンを取得"""
        try:
            pr = cls.objects.get(token_hash=hash_token(token), is_used=False)
            if pr.is_expired:
                return None
            return pr
        except cls.DoesNotExist:
            return None
