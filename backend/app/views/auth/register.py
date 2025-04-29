import graphene
from graphene_django.types import DjangoObjectType
from django.core.exceptions import ValidationError
from app.models import User
import uuid
from django.db import transaction
from app.validators.user_validator import UserValidator
import logging

logger = logging.getLogger("app")


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
            UserValidator.validate_name(name)
            UserValidator.validate_email(email, email_confirm)
            UserValidator.validate_password(password)
            logger.info("バリデーション成功")

            # ユーザーの作成
            logger.info(f"ユーザー作成開始: email={email}")
            user = User.objects.create(
                id=uuid.uuid4(), name=name, email=email, icon="default.png"
            )
            user.set_password(password)
            user.save()
            logger.info(f"ユーザー作成完了: user_id={user.id}")

            return RegisterUser(user=user, success=True, errors=[])

        except ValidationError as e:
            logger.warning(f"バリデーションエラー: email={email}, error={str(e)}")
            return RegisterUser(success=False, errors=[str(e)])
        except Exception as e:
            logger.error(
                f"ユーザー登録エラー: email={email}, error={str(e)}", exc_info=True
            )
            return RegisterUser(
                success=False,
                errors=[f"ユーザー登録中にエラーが発生しました: {str(e)}"],
            )
