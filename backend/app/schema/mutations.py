import graphene
from ..views.auth.register import Mutation as AuthMutation

class Mutation(AuthMutation, graphene.ObjectType):
    pass 