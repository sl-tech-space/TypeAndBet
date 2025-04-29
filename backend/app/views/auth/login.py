import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth import login, authenticate
from app.models.user import User
import logging

logger = logging.getLogger("app")


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "name", "email")


class LoginUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, email, password):
        try:
            logger.info(f"ログイン試行: email={email}")

            # ユーザーの認証
            user = authenticate(email=email, password=password)
            if user is None:
                logger.warning(f"認証失敗: email={email}")
                return LoginUser(
                    success=False,
                    errors=["メールアドレスまたはパスワードが正しくありません"],
                )

            # ログイン処理
            login(info.context, user)
            logger.info(f"ログイン成功: user_id={user.id}, email={email}")

            return LoginUser(success=True, errors=[])

        except Exception as e:
            logger.error(
                f"ログインエラー: email={email}, error={str(e)}", exc_info=True
            )
            return LoginUser(
                success=False, errors=["ログイン処理中にエラーが発生しました"]
            )
