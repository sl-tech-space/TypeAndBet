from graphql import GraphQLError
from typing import List, Optional
import logging

logger = logging.getLogger("app")


class BaseError(GraphQLError):
    """基本エラークラス"""

    def __init__(
        self,
        message: str,
        code: str,
        status: int,
        details: Optional[List[str]] = None,
    ):
        super().__init__(
            message=message,
            extensions={"code": code, "status": status, "details": details or []},
        )


class ErrorHandler:
    """エラーハンドリングの共通クラス"""

    @staticmethod
    def handle_unexpected_error(
        error: Exception, context: Optional[str] = None
    ) -> BaseError:
        """予期せぬエラーの処理"""
        logger.error(
            f"予期せぬエラー発生: context={context}, error={str(error)}", exc_info=True
        )
        return BaseError(
            message="予期せぬエラーが発生しました",
            code="INTERNAL_SERVER_ERROR",
            status=500,
            details=[
                "システムエラーが発生しました。しばらく時間をおいて再度お試しください"
            ],
        )
