from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from app.models import User

class UserValidator:
    @staticmethod
    def validate_name(name):
        if len(name) > 15:
            raise ValidationError("ユーザー名は15文字以内で入力してください")
        if User.objects.filter(name=name).exists():
            raise ValidationError("このユーザー名は既に使用されています")

    @staticmethod
    def validate_email(email, email_confirm):
        if email != email_confirm:
            raise ValidationError("メールアドレスが一致しません")
        
        validator = EmailValidator()
        try:
            validator(email)
        except ValidationError:
            raise ValidationError("有効なメールアドレスを入力してください")
            
        if User.objects.filter(email=email).exists():
            raise ValidationError("このメールアドレスは既に使用されています")

    @staticmethod
    def validate_password(password):
        if len(password) > 255:
            raise ValidationError("パスワードは255文字以内で入力してください")