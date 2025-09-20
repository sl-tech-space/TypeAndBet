import os

# 本番環境向けのセキュリティ関連設定

# 明示的に無効化（環境変数で上書き可）
DEBUG = False

# 代理サーバ（例: Nginx/ALB）経由での HTTPS を認識
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# HTTPS へのリダイレクト
SECURE_SSL_REDIRECT = os.getenv("DJANGO_SECURE_SSL_REDIRECT", "true").lower() == "true"

# Cookie のセキュア属性
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# SameSite
SESSION_COOKIE_SAMESITE = os.getenv("DJANGO_SESSION_COOKIE_SAMESITE", "Lax")
CSRF_COOKIE_SAMESITE = os.getenv("DJANGO_CSRF_COOKIE_SAMESITE", "Lax")

# HSTS（preload はドメイン運用に合わせて有効化）
SECURE_HSTS_SECONDS = int(
    os.getenv("DJANGO_SECURE_HSTS_SECONDS", str(60 * 60 * 24 * 365))
)
SECURE_HSTS_INCLUDE_SUBDOMAINS = (
    os.getenv("DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", "true").lower() == "true"
)
SECURE_HSTS_PRELOAD = os.getenv("DJANGO_SECURE_HSTS_PRELOAD", "true").lower() == "true"

# その他セキュリティヘッダ
SECURE_REFERRER_POLICY = os.getenv("DJANGO_SECURE_REFERRER_POLICY", "same-origin")
SECURE_CONTENT_TYPE_NOSNIFF = True

# CORS は base.py で環境変数から読み込み済み。明示しておく
CORS_ALLOW_ALL_ORIGINS = False
