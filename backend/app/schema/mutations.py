import graphene

from app.views.auth.googleauth import GoogleAuth, RefreshToken
from app.views.auth.login import LoginUser
from app.views.auth.register import RegisterUser
from app.views.auth.email_verification import VerifyEmail, ResendVerificationEmail
from app.views.game.simulation import CompletePractice
from app.views.game.textgenerator import GenerateText
from app.views.game.textpair import ConvertToHiragana, GetRandomTextPair
from app.views.game.typeandbet import CreateBet, UpdateGameScore


class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    google_auth = GoogleAuth.Field()
    refresh_token = RefreshToken.Field()
    verify_email = VerifyEmail.Field()
    resend_verification_email = ResendVerificationEmail.Field()
    create_bet = CreateBet.Field()
    update_game_score = UpdateGameScore.Field()
    generate_text = GenerateText.Field()
    get_random_text_pair = GetRandomTextPair.Field()
    convert_to_hiragana = ConvertToHiragana.Field()
    complete_practice = CompletePractice.Field()
