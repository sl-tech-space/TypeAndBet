import logging
import graphene
from django.conf import settings

from app.models import User, PasswordReset
from app.utils.email_service import EmailService
from app.utils.validators import UserValidator, ValidationError
from app.utils.logging_utils import mask_email
from app.utils.errors import BaseError, ErrorHandler
from app.utils.constants import AuthErrorMessages
from app.utils.graphql_throttling import graphql_throttle, get_user_identifier

logger = logging.getLogger("app")


class PasswordResetError(BaseError):
    def __init__(
        self,
        message: str,
        code: str = "PASSWORD_RESET_ERROR",
        details: list[str] | None = None,
    ):
        super().__init__(message=message, code=code, status=400, details=details)


class RequestPasswordReset(graphene.Mutation):
    """パスワードリセットメールを送信するミューテーション"""

    class Arguments:
        email = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    @classmethod
    @graphql_throttle('3/m', get_user_identifier)
    def mutate(cls, root, info, email):
        try:
            # email フォーマットのみ検証。存在有無に関わらず成功レスポンスを返す（情報漏洩対策）
            try:
                UserValidator.validate_email(email)
            except ValidationError:
                # 既存の validate_email は重複チェックも行うため、フォーマットのみ再検証
                from django.core.validators import EmailValidator
                from django.core.exceptions import (
                    ValidationError as DjangoValidationError,
                )

                validator = EmailValidator()
                try:
                    validator(email)
                except DjangoValidationError:
                    raise PasswordResetError(
                        message=AuthErrorMessages.INVALID_INPUT,
                        code="INVALID_EMAIL_FORMAT",
                        details=[AuthErrorMessages.INVALID_EMAIL_FORMAT],
                    )

            # ユーザーが存在すればトークン発行と送信
            try:
                user = User.objects.get(email=email)
                pr = PasswordReset.create_for_user(user, expiration_hours=1)

                frontend_url = getattr(
                    settings, "FRONTEND_URL", "http://localhost:3000"
                )
                reset_path = getattr(
                    settings, "FRONTEND_RESET_PASSWORD_PATH", "/reset-password"
                )
                raw_token = getattr(pr, "_raw_token", None)
                reset_url = f"{frontend_url}{reset_path}?token={raw_token}"

                EmailService.send_password_reset_email(
                    to_email=user.email,
                    username=user.name,
                    reset_url=reset_url,
                    expiration_minutes=60,
                )
            except User.DoesNotExist:
                # 存在しない場合でも成功レスポンス（同じメッセージ）
                pass

            logger.info(f"パスワードリセット要求受付: email={mask_email(email)}")
            return RequestPasswordReset(
                success=True,
                message="パスワードリセット手順を送信しました。",
                errors=[],
            )

        except PasswordResetError as e:
            logger.warning(f"パスワードリセット要求エラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "RequestPasswordReset")


class ResetPassword(graphene.Mutation):
    """トークンを用いたパスワード再設定"""

    class Arguments:
        token = graphene.String(required=True)
        password = graphene.String(required=True)
        password_confirm = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, token, password, password_confirm):
        try:
            from app.utils.validators import UserValidator

            # パスワード検証
            UserValidator.validate_password(password, password_confirm)

            pr = PasswordReset.get_valid_token(token)
            if not pr:
                raise PasswordResetError(
                    message=AuthErrorMessages.INVALID_TOKEN,
                    code="INVALID_TOKEN",
                    details=["トークンが無効か期限切れです"],
                )

            # パスワード更新
            user = pr.user
            user.set_password(password)
            user.save()

            # トークンを使用済みに
            pr.use()

            logger.info(f"パスワードリセット完了: user_id={user.id}")
            return ResetPassword(
                success=True, message="パスワードを再設定しました。", errors=[]
            )

        except PasswordResetError as e:
            logger.warning(f"パスワード再設定エラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "ResetPassword")
