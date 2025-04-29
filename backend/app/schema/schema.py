import graphene
from app.schema.queries import Query
from app.schema.mutations import Mutation

schema = graphene.Schema(query=Query, mutation=Mutation)
