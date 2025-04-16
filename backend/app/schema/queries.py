import graphene
from graphene_django.types import DjangoObjectType
from app.models import User
from app.views.ranking.total import RankingType

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'created_at')

class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.UUID())
    rankings = graphene.List(
        RankingType,
        limit=graphene.Int(),
        offset=graphene.Int()
    )

    def resolve_users(self, info):
        return User.objects.all()

    def resolve_user(self, info, id):
        return User.objects.get(id=id)

    def resolve_rankings(self, info, limit=10, offset=0):
        from app.views.ranking.total import Query as RankingQuery
        return RankingQuery().resolve_rankings(info, limit, offset)