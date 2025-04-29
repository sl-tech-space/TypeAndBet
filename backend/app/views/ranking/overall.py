import graphene
from graphene_django.types import DjangoObjectType
from app.models.ranking import Ranking
import logging

logger = logging.getLogger("app")


class RankingType(DjangoObjectType):
    class Meta:
        model = Ranking
        fields = ("ranking", "created_at", "updated_at")

    name = graphene.String()
    icon = graphene.String()
    gold = graphene.Int()

    def resolve_name(self, info):
        logger.debug(f"ユーザー名取得: user_id={self.user.id}")
        return self.user.name

    def resolve_icon(self, info):
        logger.debug(f"ユーザーアイコン取得: user_id={self.user.id}")
        return self.user.icon

    def resolve_gold(self, info):
        logger.debug(f"ユーザー所持金取得: user_id={self.user.id}")
        return self.user.gold


class Query(graphene.ObjectType):
    rankings = graphene.List(RankingType, limit=graphene.Int(), offset=graphene.Int())

    def resolve_rankings(self, info, limit=10, offset=0):
        try:
            logger.info(f"ランキング取得開始: limit={limit}, offset={offset}")

            # ランキングの取得
            rankings = Ranking.objects.all()
            total_count = rankings.count()
            logger.info(f"総ランキング数: {total_count}")

            # ページネーション
            result = rankings[offset : offset + limit]
            logger.info(f"取得ランキング数: {len(result)}")

            # 取得したランキングの詳細をログ出力
            for ranking in result:
                logger.info(
                    f"ランキング情報: rank={ranking.ranking}, "
                    f"user_id={ranking.user.id}, "
                    f"name={ranking.user.name}, "
                    f"gold={ranking.user.gold}"
                )

            return result

        except Exception as e:
            logger.error(f"ランキング取得エラー: {str(e)}", exc_info=True)
            raise
