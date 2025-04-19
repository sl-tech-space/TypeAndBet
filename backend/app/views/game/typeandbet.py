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

                # Zスコアに基づいて掛け金の倍率を計算（より細かい区切り）
                if z_score >= 3.0:
                    multiplier = 3.0  # 上位0.1%
                elif z_score >= 2.5:
                    multiplier = 2.5  # 上位0.6%
                elif z_score >= 2.0:
                    multiplier = 2.0  # 上位2.3%
                elif z_score >= 1.5:
                    multiplier = 1.75  # 上位6.7%
                elif z_score >= 1.0:
                    multiplier = 1.5  # 上位15.9%
                elif z_score >= 0.5:
                    multiplier = 1.25  # 上位30.9%
                elif z_score >= 0.0:
                    multiplier = 1.0  # 上位50%
                elif z_score >= -0.5:
                    multiplier = -1.0  # 下位30.9%
                elif z_score >= -1.0:
                    multiplier = -1.5  # 下位15.9%
                elif z_score >= -1.5:
                    multiplier = -2.0  # 下位6.7%
                elif z_score >= -2.0:
                    multiplier = -2.5  # 下位2.3%
                elif z_score >= -2.5:
                    multiplier = -3.0  # 下位0.6%
                else:
                    multiplier = -4.0  # 下位0.1%

                # ゴールドの変化を計算（掛け金の倍率を適用）
                if multiplier >= 0:
                    # プラスの倍率：掛け金 × 倍率
                    gold_change = int(game.bet_amount * multiplier)
                else:
                    # マイナスの倍率：掛け金 × |倍率| をマイナス
                    # 掛け金が大きいほど損失も大きくなる
                    base_loss = int(game.bet_amount * abs(multiplier))
                    # 掛け金が大きいほど追加の損失を加算
                    additional_loss = int(game.bet_amount * 0.1)  # 掛け金の10%を追加損失
                    total_loss = base_loss + additional_loss
                    
                    # 現在の所持金を超える損失にならないように調整
                    if total_loss > user.gold:
                        total_loss = user.gold
                    
                    gold_change = -total_loss

                # ゲームのスコアとゴールド変化を更新
                game.score = score
                game.gold_change = gold_change  # 純利益（掛け金は既に引かれている）
                game.save()

                # ユーザーの所持金を更新
                user.gold += gold_change
                user.save()

                # ランキングの更新
                ranking, created = Ranking.objects.get_or_create(user=user)
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

