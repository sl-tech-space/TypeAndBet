import graphene
from graphene_django.types import DjangoObjectType
from django.core.exceptions import ValidationError
from app.models import User
import uuid
from django.db import transaction
from app.validators.user_validator import UserValidator

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')

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
            # バリデーション
            UserValidator.validate_name(name)
            UserValidator.validate_email(email, email_confirm)
            UserValidator.validate_password(password)

            # ユーザーの作成
            user = User.objects.create(
                id=uuid.uuid4(),
                name=name,
                email=email,
                icon='default.png'
            )
            user.set_password(password)
            user.save()

            return RegisterUser(user=user, success=True, errors=[])

        except ValidationError as e:
            return RegisterUser(success=False, errors=[str(e)])
        except Exception as e:
            return RegisterUser(success=False, errors=[f'ユーザー登録中にエラーが発生しました: {str(e)}'])
