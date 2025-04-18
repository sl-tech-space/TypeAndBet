import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth import get_user_model
from django.contrib.auth import login
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
import requests

User = get_user_model()

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')

class GoogleAuth(graphene.Mutation):
    class Arguments:
        access_token = graphene.String(required=True)

    user = graphene.Field(UserType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, access_token):
        try:
            # Googleからユーザー情報を取得
            response = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            user_info = response.json()

            if 'error' in user_info:
                return GoogleAuth(success=False, errors=['認証に失敗しました'])

            # メールアドレスでユーザーを検索
            user = User.objects.filter(email=user_info['email']).first()

            if not user:
                # 新規ユーザー作成
                user = User.objects.create(
                    name=user_info.get('name', user_info['email'].split('@')[0]),
                    email=user_info['email']
                )

            # ログイン処理
            login(info.context, user)

            return GoogleAuth(user=user, success=True, errors=[])

        except Exception as e:
            return GoogleAuth(success=False, errors=['認証処理中にエラーが発生しました'])

class Mutation(graphene.ObjectType):
    google_auth = GoogleAuth.Field()
