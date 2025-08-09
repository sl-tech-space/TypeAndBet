import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth import authenticate
from app.models.user import User
import logging
from app.utils.errors import BaseError, ErrorHandler
from app.utils.validators import ValidationError
from app.utils.constants import AuthErrorMessages
from typing import List, Optional
import jwt
from datetime import datetime, timedelta
import os
import secrets

logger = logging.getLogger("app")

# JWTの設定
JWT_SECRET = os.getenv("JWT_SECRET", secrets.token_hex(32))
ACCESS_TOKEN_EXPIRE_DAYS = 14  # フロントエンド側のセッション戦略に合わせて14日間に変更
REFRESH_TOKEN_EXPIRE_DAYS = 30


class AuthenticationError(BaseError):
    """認証エラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        code: str = "AUTHENTICATION_ERROR",
        details: Optional[List[str]] = None,
    ):
        super().__init__(
            message=message,
            code=code,
            status=401,
            details=details,
        )


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "name", "email")


class TokenType(graphene.ObjectType):
    """認証トークンのGraphQL型定義"""

    accessToken = graphene.String()
    refreshToken = graphene.String()
    expiresAt = graphene.Int()


def generate_tokens(user):
    try:
        logger.info(f"トークン生成開始: user_id={user.id}")
        # アクセストークン（14日間有効）
        access_token_expires = datetime.now() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
        access_token = jwt.encode(
            {
                "user_id": str(user.id),
                "exp": access_token_expires.timestamp(),
                "type": "access",
            },
            JWT_SECRET,
            algorithm="HS256",
        )
        logger.info(f"アクセストークン生成完了: user_id={user.id}")

        # リフレッシュトークン（30日有効）
        refresh_token_expires = datetime.now() + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )
        refresh_token = jwt.encode(
            {
                "user_id": str(user.id),
                "exp": refresh_token_expires.timestamp(),
                "type": "refresh",
                "jti": secrets.token_hex(16),
            },
            JWT_SECRET,
            algorithm="HS256",
        )
        logger.info(f"リフレッシュトークン生成完了: user_id={user.id}")

        return {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "expiresAt": int(access_token_expires.timestamp()),
        }
    except Exception as e:
        logger.error(
            f"トークン生成エラー: user_id={user.id}, error={str(e)}", exc_info=True
        )
        raise AuthenticationError(
            message=AuthErrorMessages.AUTHENTICATION_FAILED,
            code="TOKEN_GENERATION_ERROR",
            details=[AuthErrorMessages.TOKEN_GENERATION_ERROR],
        )


class LoginUser(graphene.Mutation):
    """ユーザーのログイン認証を行い、アクセストークンを発行するミューテーション"""

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    user = graphene.Field(UserType)
    tokens = graphene.Field(TokenType)

    @classmethod
    def mutate(cls, root, info, email: str, password: str):
        try:
            logger.info(f"ログイン試行開始: email={email}")

            # 入力値のバリデーション
            if not email or not password:
                logger.warning(f"必須項目が未入力: email={email}, password={password}")
                raise ValidationError(
                    message=AuthErrorMessages.INVALID_INPUT,
                    details=[AuthErrorMessages.REQUIRED_FIELDS_MISSING],
                )

            # メールアドレスの形式チェック
            if "@" not in email:
                logger.warning(f"メールアドレス形式不正: email={email}")
                raise ValidationError(
                    message=AuthErrorMessages.INVALID_INPUT,
                    details=[AuthErrorMessages.INVALID_EMAIL_FORMAT],
                )

            # ユーザーの認証
            logger.info(f"ユーザー認証開始: email={email}")
            user = authenticate(email=email, password=password)
            if user is None:
                logger.warning(f"認証失敗: email={email}")
                raise AuthenticationError(
                    message=AuthErrorMessages.AUTHENTICATION_FAILED,
                    code="INVALID_CREDENTIALS",
                    details=[AuthErrorMessages.INVALID_CREDENTIALS],
                )

            # JWT認証ではDjangoのセッションログインは不要
            logger.info(f"JWT認証処理開始: user_id={user.id}, email={email}")
            logger.info(f"JWT認証成功: user_id={user.id}, email={email}")

            # トークン生成
            tokens = generate_tokens(user)
            logger.info(f"トークン生成完了: user_id={user.id}")

            return LoginUser(
                success=True,
                errors=[],
                user=user,
                tokens=TokenType(**tokens),
            )

        except (ValidationError, AuthenticationError) as e:
            logger.warning(f"ログインエラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "LoginUser")
