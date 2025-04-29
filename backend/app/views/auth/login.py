import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth import login, authenticate
from app.models.user import User
import logging
from app.utils.errors import BaseError, ErrorHandler
from app.utils.validators import ValidationError
from app.utils.constants import AuthErrorMessages
from typing import List, Optional

logger = logging.getLogger("app")


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


class LoginUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, email: str, password: str):
        try:
            logger.info(f"ログイン試行開始: email={email}")

            # 入力値のバリデーション
            if not email or not password:
                logger.warning("必須項目が未入力: email={email}, password={password}")
                raise ValidationError(
                    message=AuthErrorMessages.INVALID_INPUT,
                    details=["メールアドレスとパスワードは必須です"],
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

            # ログイン処理
            logger.info(f"ログイン処理開始: user_id={user.id}, email={email}")
            login(info.context, user)
            logger.info(f"ログイン成功: user_id={user.id}, email={email}")

            return LoginUser(success=True, errors=[], user=user)

        except (ValidationError, AuthenticationError) as e:
            logger.warning(f"ログインエラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "LoginUser")
