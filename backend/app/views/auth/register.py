import graphene
from graphene_django.types import DjangoObjectType
from app.models import User
import uuid
from django.db import transaction
from app.utils.validators import ValidationError, UserValidator
import logging
from app.utils.errors import BaseError, ErrorHandler
from app.utils.constants import AuthErrorMessages
from typing import List, Optional

logger = logging.getLogger("app")


class RegistrationError(BaseError):
    """登録に関するエラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        code: str = "REGISTRATION_ERROR",
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
        fields = ("id", "name", "email")


class RegisterUser(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        email_confirm = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, name, email, email_confirm, password):
        try:
            logger.info(f"ユーザー登録開始: email={email}, name={name}")

            # バリデーション
            logger.info("バリデーション開始")
            try:
                UserValidator.validate_name(name)
                logger.info("ユーザー名バリデーション成功")
            except ValidationError as e:
                logger.warning(f"ユーザー名バリデーション失敗: {str(e)}")
                raise e

            try:
                UserValidator.validate_email(email, email_confirm)
                logger.info("メールアドレスバリデーション成功")
            except ValidationError as e:
                logger.warning(f"メールアドレスバリデーション失敗: {str(e)}")
                raise e

            try:
                UserValidator.validate_password(password)
                logger.info("パスワードバリデーション成功")
            except ValidationError as e:
                logger.warning(f"パスワードバリデーション失敗: {str(e)}")
                raise e

            logger.info("すべてのバリデーション成功")

            # メールアドレスの重複チェック
            if User.objects.filter(email=email).exists():
                logger.warning(f"メールアドレス重複: email={email}")
                raise RegistrationError(
                    message=AuthErrorMessages.INVALID_INPUT,
                    code="DUPLICATE_EMAIL",
                    status=400,
                    details=[AuthErrorMessages.DUPLICATE_EMAIL],
                )

            # ユーザーの作成
            logger.info(f"ユーザー作成開始: email={email}")
            user = User.objects.create(
                id=uuid.uuid4(), name=name, email=email, icon="default.png"
            )
            user.set_password(password)
            user.save()
            logger.info(f"ユーザー作成完了: user_id={user.id}, email={email}")

            return RegisterUser(user=user, success=True, errors=[])

        except (ValidationError, RegistrationError) as e:
            logger.warning(f"登録エラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "RegisterUser")
