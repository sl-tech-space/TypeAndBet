import logging
import os
import secrets

import jwt
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger("app")

User = get_user_model()

# JWTの設定（認証ファイルと同じ設定を使用）
JWT_SECRET = os.getenv("JWT_SECRET", secrets.token_hex(32))


class JWTAuthenticationMiddleware:
    """JWT認証に対応したGraphQLミドルウェア"""

    def __init__(self):
        self.user_model = User

    def resolve(self, next, root, info, **args):
        """GraphQLリゾルバーでJWTトークンからユーザーを取得"""
        try:
            # リクエストオブジェクトを取得
            request = info.context

            # 既に認証済みの場合はスキップ
            if hasattr(request, "_jwt_authenticated"):
                return next(root, info, **args)

            # Authorizationヘッダーからトークンを取得
            auth_header = request.META.get("HTTP_AUTHORIZATION", "")

            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

                # JWTトークンの検証
                try:
                    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
                    user_id = payload.get("user_id")

                    if user_id and payload.get("type") == "access":
                        # ユーザーを取得
                        user = self.user_model.objects.get(id=user_id)
                        request.user = user
                        # 認証済みフラグを設定
                        request._jwt_authenticated = True
                        logger.info(f"JWT認証成功: user_id={user_id}")
                    else:
                        request.user = AnonymousUser()
                        request._jwt_authenticated = True
                        logger.warning("JWTトークンのペイロードが無効")

                except jwt.ExpiredSignatureError:
                    request.user = AnonymousUser()
                    request._jwt_authenticated = True
                    logger.warning("JWTトークンの有効期限切れ")
                except jwt.InvalidTokenError:
                    request.user = AnonymousUser()
                    request._jwt_authenticated = True
                    logger.warning("無効なJWTトークン")
                except self.user_model.DoesNotExist:
                    request.user = AnonymousUser()
                    request._jwt_authenticated = True
                    logger.warning(f"ユーザーが存在しません: user_id={user_id}")
                except Exception as e:
                    request.user = AnonymousUser()
                    request._jwt_authenticated = True
                    logger.error(f"JWT認証エラー: {str(e)}")
            else:
                # トークンがない場合は匿名ユーザー
                request.user = AnonymousUser()
                request._jwt_authenticated = True

        except Exception as e:
            logger.error(f"JWTミドルウェアエラー: {str(e)}")
            request.user = AnonymousUser()
            request._jwt_authenticated = True

        return next(root, info, **args)
