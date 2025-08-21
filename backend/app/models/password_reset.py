import hashlib
import secrets
import uuid
from datetime import datetime, timedelta

from django.db import models

from app.utils.constants import EmailConstants, ModelConstants

from .user import User


class PasswordReset(models.Model):
    """パスワードリセット用のトークンモデル"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="password_resets"
    )
    token_hash = models.CharField(
        max_length=ModelConstants.MAX_TOKEN_HASH_LENGTH, unique=True, null=False
    )
    expires_at = models.DateTimeField(null=False)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "password_resets"
        indexes = [
            models.Index(fields=["token_hash"], name="idx_password_reset_token"),
            models.Index(fields=["expires_at"], name="idx_password_reset_expires"),
        ]

    def __str__(self):
        return f"PasswordReset {self.id}: {self.user.email}"

    @classmethod
    def create_for_user(
        cls,
        user,
        expiration_hours: int = EmailConstants.DEFAULT_PASSWORD_RESET_EXPIRATION_HOURS,
    ):
        """ユーザー用のパスワードリセットトークンを作成する"""
        # 既存の未使用トークンを無効化
        cls.objects.filter(user=user, is_used=False).update(is_used=True)

        # 新しいトークンを生成
        raw_token = secrets.token_urlsafe(ModelConstants.TOKEN_HEX_LENGTH)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = datetime.now() + timedelta(hours=expiration_hours)

        # トークンを作成
        password_reset = cls.objects.create(
            user=user,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        # 平文トークンを一時的に保存（メール送信用）
        password_reset._raw_token = raw_token

        return password_reset

    @classmethod
    def get_valid_token(cls, token):
        """有効なトークンを取得する"""
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        now = datetime.now()

        try:
            password_reset = cls.objects.get(
                token_hash=token_hash,
                expires_at__gt=now,
                is_used=False,
            )
            return password_reset
        except cls.DoesNotExist:
            return None

    def use(self):
        """トークンを使用済みにする"""
        self.is_used = True
        self.save()
