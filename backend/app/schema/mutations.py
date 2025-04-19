import graphene
from app.views.auth.register import RegisterUser
from app.views.auth.login import LoginUser
from app.views.auth.googleauth import GoogleAuth
from app.views.game.typeandbet import CreateBet, UpdateGameScore
from app.views.game.textgenerator import GenerateText

class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    google_auth = GoogleAuth.Field()
    create_bet = CreateBet.Field() 
    update_game_score = UpdateGameScore.Field()
    generate_text = GenerateText.Field() 
