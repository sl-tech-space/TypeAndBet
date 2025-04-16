import graphene
from graphene_django.types import DjangoObjectType
from django.core.exceptions import ValidationError
from app.models import User
import uuid
from django.contrib.auth.hashers import make_password
from django.db import transaction
from app.validators.user_validator import UserValidator

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
        try:
            # バリデーション
            UserValidator.validate_name(name)
            UserValidator.validate_email(email, email_confirm)
            UserValidator.validate_password(password)

            # ユーザー作成
            user = User.objects.create(
                id=uuid.uuid4(),
                name=name,
                email=email,
                password=make_password(password),
                icon='default.png'
            )

            return RegisterUser(user=user, success=True, errors=None)
        except ValidationError as e:
            return RegisterUser(user=None, success=False, errors=[str(e)])
        except Exception as e:
            return RegisterUser(user=None, success=False, errors=[str(e)])

class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
