from django.core.exceptions import ValidationError


class GameValidator:
    @staticmethod
    def validate_bet_amount(bet_amount):
        if bet_amount < 100 or bet_amount > 700:
            raise ValidationError("掛け金は100から700の間で設定してください")

    @staticmethod
    def validate_user_gold(user_gold, bet_amount):
        if user_gold < bet_amount:
            raise ValidationError("所持金が不足しています")

    @staticmethod
    def validate_correct_typed(correct_typed):
        if correct_typed < 0:
            raise ValidationError("正タイプ数は0以上である必要があります")

    @staticmethod
    def validate_accuracy(accuracy):
        if accuracy <= 0 or accuracy > 1:
            raise ValidationError("正タイプ率は0より大きく1以下である必要があります")
