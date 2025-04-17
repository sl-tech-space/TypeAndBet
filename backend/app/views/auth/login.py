import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth import login
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

    def mutate(self, info, email, password):
        try:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return LoginUser(success=False, errors=['メールアドレスまたはパスワードが正しくありません'])

            if not user.check_password(password):
                return LoginUser(success=False, errors=['メールアドレスまたはパスワードが正しくありません'])

            # セッションを作成
            session = SessionStore()
            session['user_id'] = str(user.id)
            session['user_name'] = user.name
            session['user_email'] = user.email
            session.save()
            
            # レスポンスヘッダーにセッションIDを設定
            info.context.session = session

            return LoginUser(success=True, errors=None)
        except Exception as e:
            return LoginUser(success=False, errors=[str(e)])

class Mutation(graphene.ObjectType):
    login_user = LoginUser.Field()
