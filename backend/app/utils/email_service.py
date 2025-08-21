import logging

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from app.utils.logging_utils import mask_email

logger = logging.getLogger("app")


class EmailService:
    """メール送信サービス"""

    @classmethod
    def send_verification_email(
        cls,
        to_email: str,
        username: str,
        verification_url: str,
        expiration_hours: int = 24,
    ) -> bool:
        """
        メール確認メールを送信

        Args:
            to_email: 送信先メールアドレス
            username: ユーザー名
            verification_url: 確認用URL

        Returns:
            bool: 送信成功時True、失敗時False
        """
        try:
            from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com")

            subject = "【TypeAndBet】メールアドレスの確認をお願いします"

            # HTMLメールの内容
            html_message = cls._render_verification_email_html(
                username=username,
                verification_url=verification_url,
                expiration_hours=expiration_hours,
            )

            # プレーンテキストメールの内容
            plain_message = strip_tags(html_message)

            # メール送信
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=from_email,
                recipient_list=[to_email],
                html_message=html_message,
                fail_silently=False,
            )

            logger.info(f"メール確認メール送信成功: {mask_email(to_email)}")
            return True

        except Exception as e:
            logger.error(
                f"メール確認メール送信失敗: {mask_email(to_email)}, エラー: {str(e)}",
                exc_info=True,
            )
            return False

    @classmethod
    def _render_verification_email_html(
        cls, username: str, verification_url: str, expiration_hours: int
    ) -> str:
        """メール確認メールのHTMLテンプレートをレンダリング"""
        context = {
            "username": username,
            "verification_url": verification_url,
            "expiration_hours": expiration_hours,
        }

        return render_to_string("email/verification.html", context)

    @classmethod
    def send_welcome_email(cls, to_email: str, username: str) -> bool:
        """
        ウェルカムメールを送信

        Args:
            to_email: 送信先メールアドレス
            username: ユーザー名

        Returns:
            bool: 送信成功時True、失敗時False
        """
        try:
            from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com")

            subject = "【TypeAndBet】アカウント登録完了"

            # HTMLメールの内容
            html_message = cls._render_welcome_email_html(username=username)

            # プレーンテキストメールの内容
            plain_message = strip_tags(html_message)

            # メール送信
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=from_email,
                recipient_list=[to_email],
                html_message=html_message,
                fail_silently=False,
            )

            logger.info(f"ウェルカムメール送信成功: {mask_email(to_email)}")
            return True

        except Exception as e:
            logger.error(
                f"ウェルカムメール送信失敗: {mask_email(to_email)}, エラー: {str(e)}",
                exc_info=True,
            )
            return False

    @classmethod
    def _render_welcome_email_html(cls, username: str) -> str:
        """ウェルカムメールのHTMLテンプレートをレンダリング"""
        context = {
            "username": username,
        }

        return render_to_string("email/welcome.html", context)

    @classmethod
    def send_password_reset_email(
        cls,
        to_email: str,
        username: str,
        reset_url: str,
        expiration_minutes: int = 60,
    ) -> bool:
        """パスワードリセットメールを送信"""
        try:
            from_email = (
                getattr(settings, "DEFAULT_FROM_EMAIL", "")
                or getattr(settings, "EMAIL_HOST_USER", "")
                or "noreply@example.com"
            )

            subject = "【TypeAndBet】パスワード再設定のご案内"

            html_message = render_to_string(
                "email/password_reset.html",
                {
                    "username": username,
                    "reset_url": reset_url,
                    "expiration_minutes": expiration_minutes,
                },
            )
            plain_message = strip_tags(html_message)

            send_mail(
                subject=subject,
                message=plain_message,
                from_email=from_email,
                recipient_list=[to_email],
                html_message=html_message,
                fail_silently=False,
            )

            logger.info(f"パスワードリセットメール送信成功: {mask_email(to_email)}")
            return True
        except Exception as e:
            logger.error(
                f"パスワードリセットメール送信失敗: {mask_email(to_email)}, エラー: {str(e)}",
                exc_info=True,
            )
            return False
