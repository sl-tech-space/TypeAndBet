import graphene
from graphene_django.types import DjangoObjectType
from django.core.exceptions import ValidationError
from ...models import User
import uuid
from django.contrib.auth.hashers import make_password
from django.core.validators import EmailValidator
from django.db import transaction

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'gold', 'created_at')

class RegisterUser(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        email_confirm = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @transaction.atomic
    def mutate(self, info, name, email, email_confirm, password):
        errors = []

        # バリデーション
        if len(name) > 15:
            errors.append("ユーザー名は15文字以内で入力してください")
        
        if email != email_confirm:
            errors.append("メールアドレスが一致しません")
        
        if len(password) > 255:  # モデルの定義に合わせて修正
            errors.append("パスワードは255文字以内で入力してください")

        email_validator = EmailValidator()
        try:
            email_validator(email)
        except ValidationError:
            errors.append("有効なメールアドレスを入力してください")

        # 一意性チェック
        if User.objects.filter(name=name).exists():
            errors.append("このユーザー名は既に使用されています")
        
        if User.objects.filter(email=email).exists():
            errors.append("このメールアドレスは既に使用されています")

        if errors:
            return RegisterUser(success=False, errors=errors)

        try:
            # ユーザー作成
            user = User.objects.create(
                id=uuid.uuid4(),
                name=name,
                email=email,
                password=make_password(password),
                icon="default_icon.png"  # デフォルトアイコン
            )
            return RegisterUser(user=user, success=True, errors=[])
        except Exception as e:
            errors.append(str(e))
            return RegisterUser(success=False, errors=errors)

class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
