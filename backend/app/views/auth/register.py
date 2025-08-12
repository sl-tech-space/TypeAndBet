import logging
import uuid

import graphene
from django.db import transaction
from django.conf import settings
from graphene_django.types import DjangoObjectType

from app.models import User
from app.utils.constants import AuthErrorMessages
from app.utils.errors import BaseError, ErrorHandler
from app.utils.validators import UserValidator, ValidationError
from app.utils.sanitizer import sanitize_email, sanitize_password, sanitize_string
from app.utils.logging_utils import mask_email

logger = logging.getLogger("app")


class RegistrationError(BaseError):
    """登録に関するエラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        code: str = "REGISTRATION_ERROR",
        details: list[str] | None = None,
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
    """新しいユーザーを登録し、アクセストークンを発行するミューテーション"""

    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        password_confirm = graphene.String(required=True)

    user = graphene.Field(UserType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, name, email, password, password_confirm):
        try:
            # サニタイジング
            name = sanitize_string(name, max_length=255)
            email = sanitize_email(email)
            password = sanitize_password(password)
            password_confirm = sanitize_password(password_confirm)

            logger.info(f"ユーザー登録開始: email={mask_email(email)}, name={name}")

            logger.info("バリデーション開始")
            try:
                UserValidator.validate_name(name)
                logger.info("ユーザー名バリデーション成功")
            except ValidationError as e:
                logger.warning(f"ユーザー名バリデーション失敗: {str(e)}")
                raise e

            try:
                UserValidator.validate_email(email)
                logger.info("メールアドレスバリデーション成功")
            except ValidationError as e:
                logger.warning(f"メールアドレスバリデーション失敗: {str(e)}")
                raise e

            try:
                UserValidator.validate_password(password, password_confirm)
                logger.info("パスワードバリデーション成功")
            except ValidationError as e:
                logger.warning(f"パスワードバリデーション失敗: {str(e)}")
                raise e

            logger.info("すべてのバリデーション成功")

            # メールアドレスの重複チェック（アクティブ・非アクティブ両方）
            existing_user = User.objects.filter(email=email).first()

            if existing_user:
                if existing_user.is_active:
                    # 既にアクティブなユーザーが存在
                    logger.warning(f"アクティブユーザーが既に存在: email={email}")
                    raise RegistrationError(
                        message=AuthErrorMessages.INVALID_INPUT,
                        code="DUPLICATE_EMAIL",
                        status=400,
                        details=[AuthErrorMessages.DUPLICATE_EMAIL],
                    )
                else:
                    # 非アクティブユーザーが存在する場合
                    logger.info(
                        f"非アクティブユーザーが存在: email={mask_email(email)}, user_id={existing_user.id}"
                    )

                    # 既存のユーザー情報を更新
                    existing_user.name = name
                    existing_user.set_password(password)
                    existing_user.save()

                    # 既存のメール確認トークンを無効化し、新しいトークンを作成
                    from app.models import EmailVerification

                    verification = EmailVerification.create_for_user(existing_user)

                    # メール確認メールを再送信
                    from app.utils.email_service import EmailService

                    frontend_url = getattr(
                        settings, "FRONTEND_URL", "http://localhost:3000"
                    )
                    verify_path = getattr(
                        settings, "FRONTEND_VERIFY_EMAIL_PATH", "/verify-email"
                    )
                    raw_token = getattr(verification, "_raw_token", None)
                    verification_url = f"{frontend_url}{verify_path}?token={raw_token}"

                    email_sent = EmailService.send_verification_email(
                        to_email=existing_user.email,
                        username=existing_user.name,
                        verification_url=verification_url,
                    )

                    if not email_sent:
                        logger.error(
                            f"メール確認メール再送信失敗: email={mask_email(email)}"
                        )
                        logger.warning(
                            "メール送信に失敗しましたが、ユーザー情報は更新されました"
                        )

                    logger.info(
                        f"既存ユーザーの情報更新とメール再送信完了: email={mask_email(email)}"
                    )
                    return RegisterUser(user=existing_user, success=True, errors=[])

            # ユーザーの作成（メール確認前は非アクティブ）
            logger.info(f"ユーザー作成開始: email={mask_email(email)}")
            user = User.objects.create(
                id=uuid.uuid4(),
                name=name,
                email=email,
                icon="default.png",
                is_active=False,
            )
            user.set_password(password)
            user.save()
            logger.info(
                f"ユーザー作成完了: user_id={user.id}, email={mask_email(email)}"
            )

            # メール確認トークンの作成
            from app.models import EmailVerification

            verification = EmailVerification.create_for_user(user)

            # メール確認メールの送信
            from app.utils.email_service import EmailService

            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
            verify_path = getattr(
                settings, "FRONTEND_VERIFY_EMAIL_PATH", "/verify-email"
            )
            raw_token = getattr(verification, "_raw_token", None)
            verification_url = f"{frontend_url}{verify_path}?token={raw_token}"

            email_sent = EmailService.send_verification_email(
                to_email=user.email,
                username=user.name,
                verification_url=verification_url,
            )

            if not email_sent:
                logger.error(f"メール確認メール送信失敗: email={mask_email(email)}")
                # メール送信に失敗した場合でもユーザーは作成するが、警告を記録
                logger.warning("メール送信に失敗しましたが、ユーザーは作成されました")

            return RegisterUser(user=user, success=True, errors=[])

        except (ValidationError, RegistrationError) as e:
            logger.warning(f"登録エラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "RegisterUser")
