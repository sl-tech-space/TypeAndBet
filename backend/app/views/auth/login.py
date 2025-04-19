import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth import login, authenticate
from django.core.exceptions import ValidationError
from app.models.user import User
from django.contrib.sessions.backends.db import SessionStore

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')

class LoginUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, email, password):
        try:
            # ユーザーの認証
            user = authenticate(email=email, password=password)
            if user is None:
                return LoginUser(success=False, errors=['メールアドレスまたはパスワードが正しくありません'])

            # ログイン処理
            login(info.context, user)

            return LoginUser(success=True, errors=[])

        except Exception:
            return LoginUser(success=False, errors=['ログイン処理中にエラーが発生しました'])
