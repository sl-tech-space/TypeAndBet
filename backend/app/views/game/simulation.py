from graphene import ObjectType, Mutation, String, Int, Boolean, List
from graphene_django import DjangoObjectType
from django.db import transaction
from app.models import User

class CompletePractice(Mutation):
    success = Boolean()
    errors = List(String)
    gold_change = Int()

    @classmethod
    @transaction.atomic
    def mutate(cls, root, info):
        try:
            user = info.context.user
            if not user.is_authenticated:
                return CompletePractice(success=True, errors=[], gold_change=0)

            # 所持金が0の場合のみ120を付与
            if user.gold == 0:
                user.gold += 120
                user.save()
                return CompletePractice(success=True, errors=[], gold_change=120)
            
            return CompletePractice(success=True, errors=[], gold_change=0)

        except Exception as e:
            return CompletePractice(success=False, errors=[str(e)], gold_change=0)