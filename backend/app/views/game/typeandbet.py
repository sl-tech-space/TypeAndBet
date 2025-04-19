import graphene
from graphene_django.types import DjangoObjectType
from django.db import transaction
from app.models import Game, User, Ranking
from django.core.exceptions import ValidationError
from app.validators.game_validator import GameValidator
import statistics
import math

class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = ('id', 'user', 'bet_amount', 'score', 'gold_change', 'created_at')

def get_user(info):
    """ユーザー情報を取得するヘルパー関数"""
    user = info.context.user
    if not user.is_authenticated:
        raise ValidationError('ログインが必要です')
    return user

class CreateBet(graphene.Mutation):
    class Arguments:
        bet_amount = graphene.Int(required=True)

    game = graphene.Field(GameType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, bet_amount):
        try:
            # ユーザー情報の取得
            user = get_user(info)

            # バリデーション
            GameValidator.validate_bet_amount(bet_amount)
            GameValidator.validate_user_gold(user.gold, bet_amount)

            # ゲームレコードの作成
            game = Game.objects.create(
                user=user,
                bet_amount=bet_amount,
                score=0,  # 初期スコアは0
                gold_change=-bet_amount  # 掛け金分をマイナス
            )

            # ユーザーの所持金を更新
            user.gold -= bet_amount
            user.save()

            return CreateBet(game=game, success=True, errors=[])

        except ValidationError as e:
            return CreateBet(success=False, errors=[str(e)])
        except Exception as e:
            # エラーの詳細をログに出力
            print(f"Error in CreateBet: {str(e)}")
            return CreateBet(success=False, errors=[f'掛け金の設定中にエラーが発生しました: {str(e)}'])

class UpdateGameScore(graphene.Mutation):
    class Arguments:
        game_id = graphene.UUID(required=True)
        correct_typed = graphene.Int(required=True)  # 正タイプ数
        accuracy = graphene.Float(required=True)     # 正タイプ率

    game = graphene.Field(GameType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info, game_id, correct_typed, accuracy):
        try:
            # ユーザー情報の取得
            user = get_user(info)

            # バリデーション
            GameValidator.validate_correct_typed(correct_typed)
            GameValidator.validate_accuracy(accuracy)

            # ゲームの取得
            game = Game.objects.get(id=game_id)
            
            # ゲームの所有者チェック
            if game.user != user:
                raise ValidationError('このゲームを更新する権限がありません')

            # スコア計算: 正タイプ数×10÷正タイプ率
            score = int(correct_typed * 10 / accuracy)

            # 過去のスコアを取得してZスコアを計算
            past_scores = list(Game.objects.exclude(id=game_id).values_list('score', flat=True))
            if past_scores:
                median = statistics.median(past_scores)
                std_dev = statistics.stdev(past_scores) if len(past_scores) > 1 else 1
                z_score = (score - median) / std_dev if std_dev != 0 else 0

                # Zスコアに基づいて掛け金の倍率を計算
                if z_score >= 2:
                    multiplier = 2.0  # 上位2.5%
                elif z_score >= 1:
                    multiplier = 1.5  # 上位15.9%
                elif z_score >= 0:
                    multiplier = 1.0  # 上位50%
                elif z_score >= -1:
                    multiplier = 0.5  # 下位15.9%
                else:
                    multiplier = 0.0  # 下位2.5%
            else:
                # 初回の場合はデフォルトの倍率
                multiplier = 1.0

            # ゴールドの変化を計算
            gold_change = int(game.bet_amount * multiplier)

            # ゲームのスコアとゴールド変化を更新
            game.score = score
            game.gold_change = gold_change - game.bet_amount  # 掛け金を引いた純利益
            game.save()

            # ユーザーの所持金を更新
            user.gold += gold_change
            user.save()

            # ランキングの更新
            ranking, created = Ranking.objects.get_or_create(user=user)
            if score > ranking.best_score:
                ranking.best_score = score
                ranking.save()

            return UpdateGameScore(game=game, success=True, errors=[])

        except Game.DoesNotExist:
            return UpdateGameScore(success=False, errors=['ゲームが見つかりません'])
        except ValidationError as e:
            return UpdateGameScore(success=False, errors=[str(e)])
        except Exception as e:
            # エラーの詳細をログに出力
            print(f"Error in UpdateGameScore: {str(e)}")
            return UpdateGameScore(success=False, errors=[f'スコアの更新中にエラーが発生しました: {str(e)}'])

