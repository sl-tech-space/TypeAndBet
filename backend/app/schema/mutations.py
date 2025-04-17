import graphene
from app.views.auth.register import RegisterUser
from app.views.auth.login import LoginUser

class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field() 