import graphene
from app.views.auth.register import RegisterUser

class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field() 