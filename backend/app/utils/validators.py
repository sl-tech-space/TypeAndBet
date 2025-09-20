import re

from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import EmailValidator
from graphql import GraphQLError

from app.utils.constants import AuthErrorMessages, GameErrorMessages


# 遅延インポートで循環インポートを回避
def get_user_model():
    from app.models import User

    return User


class ValidationError(GraphQLError):
    """バリデーションエラーを表す例外クラス"""

    def __init__(
        self,
        message: str,
        details: list[str] | None = None,
    ):
        super().__init__(
            message=message,
            extensions={
                "code": "VALIDATION_ERROR",
                "status": 400,
                "details": details or [],
            },
        )


class UserValidator:
    @staticmethod
    def validate_name(name):
        if len(name) > 15:
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.USERNAME_TOO_LONG],
            )
        # 遅延インポートで循環インポートを回避
        User = get_user_model()
        if User.objects.filter(name=name).exists():
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.DUPLICATE_USERNAME],
            )

    @staticmethod
    def validate_email(email):
        validator = EmailValidator()
        try:
            validator(email)
        except DjangoValidationError:
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.INVALID_EMAIL_FORMAT],
            )

        User = get_user_model()
        if User.objects.filter(email=email, is_active=True).exists():
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.DUPLICATE_EMAIL],
            )

    @staticmethod
    def validate_password(password, password_confirm):
        if password != password_confirm:
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.PASSWORD_MISMATCH],
            )

        if len(password) > 255:
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.PASSWORD_TOO_LONG],
            )

        if len(re.findall(r"[A-Z]", password)) < 2:
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.PASSWORD_UPPERCASE_REQUIRED],
            )

        if len(re.findall(r"[0-9]", password)) < 2:
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.PASSWORD_NUMBER_REQUIRED],
            )

        if len(re.findall(r"[!@#$%^&*(),.?:|]", password)) < 1:
            raise ValidationError(
                message=AuthErrorMessages.INVALID_INPUT,
                details=[AuthErrorMessages.PASSWORD_SYMBOL_REQUIRED],
            )


class GameValidator:
    @staticmethod
    def validate_bet_amount(bet_amount):
        if bet_amount < 100 or bet_amount > 700:
            raise ValidationError(
                message=GameErrorMessages.INVALID_INPUT,
                details=[GameErrorMessages.BET_AMOUNT_INVALID],
            )

    @staticmethod
    def validate_user_gold(user_gold, bet_amount):
        if user_gold < bet_amount:
            raise ValidationError(
                message=GameErrorMessages.INVALID_INPUT,
                details=[GameErrorMessages.INSUFFICIENT_GOLD],
            )

    @staticmethod
    def validate_correct_typed(correct_typed):
        if correct_typed < 0:
            raise ValidationError(
                message=GameErrorMessages.INVALID_INPUT,
                details=[GameErrorMessages.CORRECT_TYPED_INVALID],
            )

    @staticmethod
    def validate_accuracy(accuracy):
        if accuracy < 0 or accuracy > 1:
            raise ValidationError(
                message=GameErrorMessages.INVALID_INPUT,
                details=[GameErrorMessages.ACCURACY_INVALID],
            )
