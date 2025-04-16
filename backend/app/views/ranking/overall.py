import graphene
from graphene_django.types import DjangoObjectType
from app.models.user import User
from app.models.ranking import Ranking

class RankingType(DjangoObjectType):
    class Meta:
        model = Ranking
        fields = ('ranking', 'gold')

    name = graphene.String()
    icon = graphene.String()

    def resolve_name(self, info):
        return self.user.name

    def resolve_icon(self, info):
        return self.user.icon

class Query(graphene.ObjectType):
    rankings = graphene.List(
        RankingType,
        limit=graphene.Int(),
        offset=graphene.Int()
    )

    def resolve_rankings(self, info, limit=10, offset=0):
        rankings = Ranking.objects.all()
        return rankings[offset:offset+limit]
