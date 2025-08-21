import uuid
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone

from app.utils.tokens import generate_token, hash_token


class EmailVerification(models.Model):
    """メール確認用のトークンモデル"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verifications",
    )
    # DBにはハッシュ化したトークンを保存する
    token_hash = models.CharField(max_length=64, unique=True, null=False)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "email_verifications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["token_hash"], name="idx_emailverif_tokenhash"),
            models.Index(fields=["user", "is_verified"]),
            models.Index(fields=["expires_at"], name="idx_emailverif_expires"),
        ]

    def __str__(self):
        return f"EmailVerification for {self.user.email}"

    @property
    def is_expired(self):
        """トークンが期限切れかどうかを判定"""
        return timezone.now() > self.expires_at

    def verify(self):
        """メール確認を完了"""
        if self.is_expired:
            raise ValueError("トークンの期限が切れています")

        self.is_verified = True
        self.verified_at = timezone.now()
        self.save()

        # ユーザーのis_activeをTrueに設定
        self.user.is_active = True
        self.user.save()

    @classmethod
    def create_for_user(cls, user, expiration_hours=24):
        """ユーザー用のメール確認トークンを作成"""
        # 既存の未確認トークンを無効化（期限切れも含む）
        cls.objects.filter(user=user, is_verified=False).update(
            is_verified=True, verified_at=timezone.now()
        )

        # 新しいトークンを作成
        raw_token = generate_token()
        token_hash = hash_token(raw_token)
        expires_at = timezone.now() + timedelta(hours=expiration_hours)

        instance = cls.objects.create(
            user=user,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        # 平文トークンは呼び出し側でURL生成に使うため返す
        instance._raw_token = raw_token  # transient attribute
        return instance

    @classmethod
    def get_valid_token(cls, token):
        """有効なトークンを取得"""
        try:
            verification = cls.objects.get(
                token_hash=hash_token(token), is_verified=False
            )

            if verification.is_expired:
                return None

            return verification
        except cls.DoesNotExist:
            return None
