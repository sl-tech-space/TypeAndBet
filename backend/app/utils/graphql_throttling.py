import logging
from functools import wraps
from typing import Callable

from graphql import GraphQLError

from .throttling import ThrottlingManager

logger = logging.getLogger("app")


class GraphQLThrottlingError(GraphQLError):
    """GraphQL用のレート制限例外"""

    pass


def graphql_throttle(limit: str, key_func: Callable = None):
    """
    GraphQLミューテーション用のレート制限デコレータ

    Args:
        limit: 制限（例: '10/m', '100/h'）
        key_func: 識別子を生成する関数

    Example:
        @graphql_throttle('10/m')
        def mutate(cls, root, info, **kwargs):
            pass
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(cls, root, info, **kwargs):
            try:
                # ユーザー識別子を生成
                if key_func:
                    identifier = key_func(info)
                else:
                    # デフォルトはユーザーIDまたはIPアドレス
                    if info.context.user.is_authenticated:
                        identifier = f"user_{info.context.user.id}"
                    else:
                        # IPアドレスを取得（GraphQLコンテキストから）
                        ip = getattr(info.context, "META", {}).get(
                            "REMOTE_ADDR", "unknown"
                        )
                        identifier = f"ip_{ip}"

                # レート制限チェック
                if ThrottlingManager.is_rate_limited(identifier, func.__name__, limit):
                    logger.warning(
                        f"GraphQLレート制限に達しました: {identifier}:{func.__name__}"
                    )
                    raise GraphQLThrottlingError(f"レート制限に達しました: {limit}")

                # カウンターをインクリメント
                ThrottlingManager.increment_counter(identifier, func.__name__, limit)

                # 元の関数を実行
                return func(cls, root, info, **kwargs)

            except GraphQLThrottlingError:
                # レート制限エラーを再送出
                raise
            except Exception as e:
                # その他のエラーは元の関数で処理
                logger.error(f"GraphQL throttling エラー: {e}")
                return func(cls, root, info, **kwargs)

        return wrapper

    return decorator


def get_user_identifier(info) -> str:
    """GraphQLコンテキストからユーザー識別子を取得する"""
    if info.context.user.is_authenticated:
        return f"user_{info.context.user.id}"
    else:
        # IPアドレスを取得
        ip = getattr(info.context, "META", {}).get("REMOTE_ADDR", "unknown")
        return f"ip_{ip}"


def get_game_action_identifier(info, action: str) -> str:
    """ゲームアクション用の識別子を取得する"""
    if info.context.user.is_authenticated:
        return f"game_{action}_{info.context.user.id}"
    else:
        ip = getattr(info.context, "META", {}).get("REMOTE_ADDR", "unknown")
        return f"game_{action}_{ip}"
