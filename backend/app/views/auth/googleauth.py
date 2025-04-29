import graphene
from graphene_django.types import DjangoObjectType
from app.models.user import User
import jwt
from datetime import datetime, timedelta
import os
import secrets
import logging

logger = logging.getLogger("app")

# JWTの設定
JWT_SECRET = os.getenv("JWT_SECRET", secrets.token_hex(32))
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "name", "email", "icon")


class TokenType(graphene.ObjectType):
    accessToken = graphene.String()
    refreshToken = graphene.String()
    expiresAt = graphene.Int()


class OAuthResponseType(graphene.ObjectType):
    user = graphene.Field(UserType)
    tokens = graphene.Field(TokenType)


def generate_tokens(user):
    # アクセストークン（1時間有効）
    access_token_expires = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = jwt.encode(
        {"user_id": str(user.id), "exp": access_token_expires.timestamp()},
        JWT_SECRET,
        algorithm="HS256",
    )

    # リフレッシュトークン（30日有効）
    refresh_token_expires = datetime.utcnow() + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )
    refresh_token = jwt.encode(
        {"user_id": str(user.id), "exp": refresh_token_expires.timestamp()},
        JWT_SECRET,
        algorithm="HS256",
    )

    return {
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "expiresAt": int(access_token_expires.timestamp()),
    }


class GoogleAuth(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        name = graphene.String(required=True)
        icon = graphene.String()

    oauthAuthenticate = graphene.Field(OAuthResponseType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

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
            else:
                logger.info(f"既存ユーザーログイン: email={email}")

            # トークン生成
            tokens = generate_tokens(user)
            logger.info(f"トークン生成完了: user_id={user.id}")

            return GoogleAuth(
                oauthAuthenticate=OAuthResponseType(
                    user=user, tokens=TokenType(**tokens)
                ),
                success=True,
                errors=[],
            )

        except Exception as e:
            logger.error(f"認証エラー: email={email}, error={str(e)}", exc_info=True)
            return GoogleAuth(
                success=False, errors=["認証処理中にエラーが発生しました"]
            )


class RefreshToken(graphene.Mutation):
    class Arguments:
        refreshToken = graphene.String(required=True)

    oauthAuthenticate = graphene.Field(OAuthResponseType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            refreshToken = kwargs.get("refreshToken")
            logger.info("リフレッシュトークン更新開始")

            # リフレッシュトークンの検証
            payload = jwt.decode(refreshToken, JWT_SECRET, algorithms=["HS256"])
            user_id = payload["user_id"]
            logger.info(f"トークン検証成功: user_id={user_id}")

            # ユーザー取得
            user = User.objects.get(id=user_id)

            # 新しいトークン生成
            tokens = generate_tokens(user)
            logger.info(f"新しいトークン生成完了: user_id={user.id}")

            return RefreshToken(
                oauthAuthenticate=OAuthResponseType(
                    user=user, tokens=TokenType(**tokens)
                ),
                success=True,
                errors=[],
            )

        except jwt.ExpiredSignatureError:
            logger.warning("リフレッシュトークンの有効期限切れ")
            return RefreshToken(
                success=False, errors=["リフレッシュトークンの有効期限が切れています"]
            )
        except jwt.InvalidTokenError:
            logger.warning("無効なリフレッシュトークン")
            return RefreshToken(
                success=False, errors=["無効なリフレッシュトークンです"]
            )
        except Exception as e:
            logger.error(f"トークン更新エラー: error={str(e)}", exc_info=True)
            return RefreshToken(
                success=False, errors=["トークンの更新中にエラーが発生しました"]
            )
