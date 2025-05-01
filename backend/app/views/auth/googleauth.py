import graphene
from graphene_django.types import DjangoObjectType
from app.models.user import User
import jwt
from datetime import datetime, timedelta
import os
import secrets
import logging
from app.utils.errors import BaseError, ErrorHandler
from app.utils.constants import AuthErrorMessages
from typing import List, Optional

logger = logging.getLogger("app")

# JWTの設定
JWT_SECRET = os.getenv("JWT_SECRET", secrets.token_hex(32))
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30


class OAuthError(BaseError):
    """OAuth認証に関するエラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        code: str = "OAUTH_ERROR",
        details: Optional[List[str]] = None,
    ):
        super().__init__(
            message=message,
            code=code,
            status=400,
            details=details,
        )


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "name", "email", "icon")


class TokenType(graphene.ObjectType):
    accessToken = graphene.String()
    refreshToken = graphene.String()
    expiresAt = graphene.Int()


def generate_tokens(user):
    try:
        logger.info(f"トークン生成開始: user_id={user.id}")
        # アクセストークン（1時間有効）
        access_token_expires = datetime.now() + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
        access_token = jwt.encode(
            {
                "user_id": str(user.id),
                "exp": access_token_expires.timestamp(),
                "type": "access"
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
                "jti": secrets.token_hex(16)
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
        raise OAuthError(
            message=AuthErrorMessages.AUTHENTICATION_FAILED,
            code="TOKEN_GENERATION_ERROR",
            details=[AuthErrorMessages.TOKEN_GENERATION_ERROR],
        )


class GoogleAuth(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        name = graphene.String(required=True)
        icon = graphene.String()

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    user = graphene.Field(UserType)
    tokens = graphene.Field(TokenType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            email = kwargs.get("email")
            name = kwargs.get("name")
            icon = kwargs.get("icon")

            logger.info(f"Google認証開始: email={email}, name={name}")

            # ユーザー検索
            user = User.objects.filter(email=email).first()

            if not user:
                logger.info(f"新規ユーザー作成: email={email}")
                user = User.objects.create(name=name, email=email, icon=icon)
                logger.info(f"新規ユーザー作成完了: user_id={user.id}, email={email}")
            else:
                logger.info(f"既存ユーザーログイン: user_id={user.id}, email={email}")

            # トークン生成
            tokens = generate_tokens(user)
            logger.info(f"トークン生成完了: user_id={user.id}")

            return GoogleAuth(
                user=user,
                tokens=TokenType(**tokens),
                success=True,
                errors=[],
            )

        except OAuthError as e:
            logger.warning(f"Google認証エラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "GoogleAuth")


class RefreshToken(graphene.Mutation):
    class Arguments:
        refreshToken = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            refreshToken = kwargs.get("refreshToken")
            logger.info("リフレッシュトークン更新開始")

            # リフレッシュトークンの検証
            try:
                payload = jwt.decode(refreshToken, JWT_SECRET, algorithms=["HS256"])
                user_id = payload["user_id"]
                logger.info(f"トークン検証成功: user_id={user_id}")
            except jwt.ExpiredSignatureError:
                logger.warning("トークンの有効期限切れ")
                raise OAuthError(
                    message=AuthErrorMessages.AUTHENTICATION_FAILED,
                    code="TOKEN_EXPIRED",
                    details=[AuthErrorMessages.TOKEN_EXPIRED],
                )
            except jwt.InvalidTokenError:
                logger.warning("無効なトークン")
                raise OAuthError(
                    message=AuthErrorMessages.AUTHENTICATION_FAILED,
                    code="INVALID_TOKEN",
                    details=[AuthErrorMessages.INVALID_TOKEN],
                )

            # ユーザー取得
            user = User.objects.get(id=user_id)
            logger.info(f"ユーザー取得成功: user_id={user.id}")

            # 新しいトークン生成
            tokens = generate_tokens(user)
            logger.info(f"新しいトークン生成完了: user_id={user.id}")

            return RefreshToken(
                user=user,
                tokens=TokenType(**tokens),
                success=True,
                errors=[],
            )

        except OAuthError as e:
            logger.warning(f"トークン更新エラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "RefreshToken")
