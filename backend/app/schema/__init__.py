from app.schema.schema import schema

from .mutations import Mutation
from .queries import Query

__all__ = ["schema", "Query", "Mutation"]
