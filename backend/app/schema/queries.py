import graphene
from graphene_django.types import DjangoObjectType
from app.models import User
from app.views.ranking.overall import RankingType

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'gold', 'icon', 'created_at')

class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.UUID())
    user_info = graphene.Field(
        UserType,
        user_id=graphene.UUID(required=True)
    )
    rankings = graphene.List(
        RankingType,
        limit=graphene.Int(),
        offset=graphene.Int()
    )

    def resolve_users(self, info):
        return User.objects.all()

    def resolve_user(self, info, id):
        return User.objects.get(id=id)

    def resolve_user_info(self, info, user_id):
        return User.objects.get(id=user_id)

    def resolve_rankings(self, info, limit=10, offset=0):
        from app.views.ranking.overall import Query as RankingQuery
        return RankingQuery().resolve_rankings(info, limit, offset)