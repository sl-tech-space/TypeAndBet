import logging

import graphene
from django.conf import settings
from django.shortcuts import redirect

from app.models import EmailVerification
from app.utils.email_service import EmailService
from app.utils.errors import BaseError, ErrorHandler
from app.utils.logging_utils import mask_email, mask_token

logger = logging.getLogger("app")


class EmailVerificationError(BaseError):
    """メール確認に関するエラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        code: str = "EMAIL_VERIFICATION_ERROR",
        details: list[str] | None = None,
    ):
        super().__init__(
            message=message,
            code=code,
            status=400,
            details=details,
        )


class VerifyEmail(graphene.Mutation):
    """メール確認を完了するミューテーション"""

    class Arguments:
        token = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, token):
        try:
            logger.info(f"メール確認開始: token={mask_token(token)}")

            # トークンの有効性をチェック
            verification = EmailVerification.get_valid_token(token)

            if not verification:
                logger.warning(f"無効なトークン: {mask_token(token)}")
                raise EmailVerificationError(
                    message="無効なトークンです。期限が切れているか、既に使用されています。",
                    code="INVALID_TOKEN",
                    details=["トークンが無効です"],
                )

            # メール確認を完了
            verification.verify()

            logger.info(
                f"メール確認完了: user_id={verification.user.id}, email={mask_email(verification.user.email)}"
            )

            # ウェルカムメールを送信
            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
            EmailService.send_welcome_email(
                to_email=verification.user.email, username=verification.user.name
            )

            return VerifyEmail(
                success=True, message="メールアドレスの確認が完了しました。", errors=[]
            )

        except EmailVerificationError as e:
            logger.warning(f"メール確認エラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "VerifyEmail")


class ResendVerificationEmail(graphene.Mutation):
    """メール確認メールを再送信するミューテーション"""

    class Arguments:
        email = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, email):
        try:
            logger.info(f"メール確認メール再送信開始: email={mask_email(email)}")

            # ユーザーの存在確認
            from app.models import User

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                logger.warning(f"ユーザーが存在しません: email={mask_email(email)}")
                raise EmailVerificationError(
                    message="このメールアドレスで登録されたユーザーが見つかりません。",
                    code="USER_NOT_FOUND",
                    details=["ユーザーが存在しません"],
                )

            # 既に確認済みかチェック
            if user.is_active:
                logger.info(f"既に確認済み: email={mask_email(email)}")
                return ResendVerificationEmail(
                    success=True,
                    message="このメールアドレスは既に確認済みです。",
                    errors=[],
                )

            # 新しい確認トークンを作成
            verification = EmailVerification.create_for_user(user)

            # メール確認メールを送信
            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
            verify_path = getattr(
                settings, "FRONTEND_VERIFY_EMAIL_PATH", "/verify-email"
            )
            # create_for_user で一時的に付与した平文トークンを使用
            raw_token = getattr(verification, "_raw_token", None)
            verification_url = (
                f"{frontend_url}{verify_path}?token={raw_token}"
                if raw_token
                else f"{frontend_url}{verify_path}"
            )

            email_sent = EmailService.send_verification_email(
                to_email=user.email,
                username=user.name,
                verification_url=verification_url,
                expiration_hours=24,
            )

            if not email_sent:
                raise EmailVerificationError(
                    message="メールの送信に失敗しました。しばらく時間をおいて再度お試しください。",
                    code="EMAIL_SEND_FAILED",
                    details=["メール送信に失敗しました"],
                )

            logger.info(f"メール確認メール再送信完了: email={mask_email(email)}")

            return ResendVerificationEmail(
                success=True, message="メール確認メールを再送信しました。", errors=[]
            )

        except EmailVerificationError as e:
            logger.warning(f"メール確認メール再送信エラー: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"予期せぬエラー発生: {str(e)}", exc_info=True)
            raise ErrorHandler.handle_unexpected_error(e, "ResendVerificationEmail")


def verify_email_view(request, token):
    """メール確認用のビュー（フロントエンドからのリダイレクト用）"""
    try:
        logger.info(f"メール確認ビュー呼び出し: token={mask_token(token)}")

        # トークンの有効性をチェック
        verification = EmailVerification.get_valid_token(token)

        if not verification:
            logger.warning(f"無効なトークン: {mask_token(token)}")
            # フロントエンドのエラーページにリダイレクト
            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
            verify_path = getattr(
                settings, "FRONTEND_VERIFY_EMAIL_PATH", "/verify-email"
            )
            return redirect(f"{frontend_url}{verify_path}?error=invalid_token")

        # メール確認を完了
        verification.verify()

        logger.info(
            f"メール確認完了: user_id={verification.user.id}, email={mask_email(verification.user.email)}"
        )

        # ウェルカムメールを送信
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
        EmailService.send_welcome_email(
            to_email=verification.user.email, username=verification.user.name
        )

        # フロントエンドの成功ページにリダイレクト
        verify_path = getattr(settings, "FRONTEND_VERIFY_EMAIL_PATH", "/verify-email")
        return redirect(f"{frontend_url}{verify_path}?success=true")

    except Exception as e:
        logger.error(f"メール確認ビューでエラー発生: {str(e)}", exc_info=True)
        # フロントエンドのエラーページにリダイレクト
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
        verify_path = getattr(settings, "FRONTEND_VERIFY_EMAIL_PATH", "/verify-email")
        return redirect(f"{frontend_url}{verify_path}?error=verification_failed")
