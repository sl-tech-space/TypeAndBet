import graphene
from graphene_django.types import DjangoObjectType

from app.models import Game, User
from app.views.game.result import GameResult, GameResultType
from app.views.game.textpair import (
    GetConvertedTextPairsType,
    GetRandomTextPairType,
    GetTextPairsType,
    resolve_get_converted_text_pairs,
    resolve_get_random_text_pair,
    resolve_get_text_pairs,
)
from app.views.ranking.overall import RankingType


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "name", "email", "gold", "icon", "created_at")


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.UUID())
    user_info = graphene.Field(UserType, user_id=graphene.UUID(required=True))
    rankings = graphene.List(RankingType, limit=graphene.Int(), offset=graphene.Int())
    game_result = graphene.Field(GameResultType, game_id=graphene.UUID(required=True))
    get_text_pairs = graphene.Field(
        GetTextPairsType,
        limit=graphene.Int(default_value=10),
        offset=graphene.Int(default_value=0),
        converted_only=graphene.Boolean(default_value=False),
    )
    get_converted_text_pairs = graphene.Field(
        GetConvertedTextPairsType,
        limit=graphene.Int(default_value=10),
        offset=graphene.Int(default_value=0),
        random=graphene.Boolean(default_value=False),
    )
    get_random_text_pair = graphene.Field(GetRandomTextPairType)

    def resolve_users(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("ログインが必要です")
        # 管理者以外は自分自身のみ返す
        if getattr(user, "is_staff", False):
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def resolve_user(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("ログインが必要です")
        if str(user.id) != str(id) and not getattr(user, "is_staff", False):
            raise Exception("権限がありません")
        return User.objects.get(id=id)

    def resolve_user_info(self, info, user_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("ログインが必要です")
        if str(user.id) != str(user_id) and not getattr(user, "is_staff", False):
            raise Exception("権限がありません")
        return User.objects.get(id=user_id)

    def resolve_rankings(self, info, limit=10, offset=0):
        from app.views.ranking.overall import Query as RankingQuery

        return RankingQuery().resolve_rankings(info, limit, offset)

    def resolve_game_result(self, info, game_id):
        """ゲーム結果を解決"""
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("ログインが必要です")
        game = Game.objects.get(id=game_id)
        if game.user != user and not getattr(user, "is_staff", False):
            raise Exception("権限がありません")
        result = GameResult(user, game)
        return result.get_result()

    def resolve_get_text_pairs(self, info, **kwargs):
        return resolve_get_text_pairs(self, info, **kwargs)

    def resolve_get_converted_text_pairs(self, info, **kwargs):
        return resolve_get_converted_text_pairs(self, info, **kwargs)

    def resolve_get_random_text_pair(self, info):
        return resolve_get_random_text_pair(self, info)
