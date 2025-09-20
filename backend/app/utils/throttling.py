import logging
from functools import wraps
from typing import Callable

from django.conf import settings
from django.core.cache import cache
from django.http import HttpRequest

logger = logging.getLogger("app")


class ThrottlingError(Exception):
    """レート制限に達した場合の例外"""

    pass


class ThrottlingManager:
    """レート制限を管理するクラス"""

    @staticmethod
    def get_cache_key(identifier: str, action: str) -> str:
        """キャッシュキーを生成する"""
        prefix = getattr(settings, "RATELIMIT_KEY_PREFIX", "rl")
        return f"{prefix}:{identifier}:{action}"

    @staticmethod
    def is_rate_limited(identifier: str, action: str, limit: str) -> bool:
        """
        レート制限に達しているかチェックする

        Args:
            identifier: 識別子（IPアドレス、ユーザーID等）
            action: アクション名
            limit: 制限（例: '10/m', '100/h'）

        Returns:
            bool: 制限に達している場合はTrue
        """
        try:
            # 制限の解析
            count, period = limit.split("/")
            count = int(count)

            # 期間を秒に変換
            if period == "s":
                window = count
            elif period == "m":
                window = count * 60
            elif period == "h":
                window = count * 3600
            elif period == "d":
                window = count * 86400
            else:
                logger.warning(f"不明な期間指定: {period}")
                return False

            cache_key = ThrottlingManager.get_cache_key(identifier, action)
            current_count = cache.get(cache_key, 0)

            if current_count >= count:
                logger.warning(
                    f"レート制限に達しました: {identifier}:{action} ({current_count}/{count})"
                )
                return True

            return False

        except Exception as e:
            logger.error(f"レート制限チェックエラー: {e}")
            return False

    @staticmethod
    def increment_counter(identifier: str, action: str, limit: str) -> None:
        """
        カウンターをインクリメントする

        Args:
            identifier: 識別子
            action: アクション名
            limit: 制限
        """
        try:
            count, period = limit.split("/")
            count = int(count)

            # 期間を秒に変換
            if period == "s":
                window = count
            elif period == "m":
                window = count * 60
            elif period == "h":
                window = count * 3600
            elif period == "d":
                window = count * 86400
            else:
                return

            cache_key = ThrottlingManager.get_cache_key(identifier, action)
            current_count = cache.get(cache_key, 0)

            # カウンターをインクリメントし、期間後に期限切れにする
            cache.set(cache_key, current_count + 1, window)

        except Exception as e:
            logger.error(f"カウンターインクリメントエラー: {e}")


def throttle(limit: str, key_func: Callable = None):
    """
    レート制限を適用するデコレータ

    Args:
        limit: 制限（例: '10/m', '100/h'）
        key_func: 識別子を生成する関数（デフォルトはIPアドレス）

    Example:
        @throttle('10/m')
        def create_game(request):
            pass

        @throttle('30/m', lambda request: f"user_{request.user.id}")
        def update_game(request):
            pass
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # リクエストオブジェクトを取得
            request = None
            for arg in args:
                if isinstance(arg, HttpRequest):
                    request = arg
                    break

            if not request:
                logger.warning("リクエストオブジェクトが見つかりません")
                return func(*args, **kwargs)

            # 識別子を生成
            if key_func:
                identifier = key_func(request)
            else:
                identifier = request.META.get("REMOTE_ADDR", "unknown")

            # レート制限チェック
            if ThrottlingManager.is_rate_limited(identifier, func.__name__, limit):
                logger.warning(f"レート制限に達しました: {identifier}:{func.__name__}")
                raise ThrottlingError(f"レート制限に達しました: {limit}")

            # カウンターをインクリメント
            ThrottlingManager.increment_counter(identifier, func.__name__, limit)

            # 元の関数を実行
            return func(*args, **kwargs)

        return wrapper

    return decorator


def get_client_ip(request: HttpRequest) -> str:
    """クライアントのIPアドレスを取得する"""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR", "unknown")
    return ip


def get_user_identifier(request: HttpRequest) -> str:
    """ユーザー識別子を取得する"""
    if request.user.is_authenticated:
        return f"user_{request.user.id}"
    else:
        return f"ip_{get_client_ip(request)}"
