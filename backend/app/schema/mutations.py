import graphene
from app.views.auth.register import RegisterUser
from app.views.auth.login import LoginUser
from app.views.auth.googleauth import GoogleAuth

class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    google_auth = GoogleAuth.Field() 