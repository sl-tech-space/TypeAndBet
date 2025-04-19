import graphene
from graphene_django.types import DjangoObjectType
from app.models import User
from app.views.ranking.overall import RankingType
from app.views.game.result import GameResult, GameResultType
from app.models import Game

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
    game_result = graphene.Field(
        GameResultType,
        game_id=graphene.ID(required=True)
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

    def resolve_game_result(self, info, game_id):
        """ゲーム結果を解決"""
        game = Game.objects.get(id=game_id)
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("ログインが必要です")
        
        result = GameResult(user, game)
        return result.get_result()