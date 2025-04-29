import os
from pathlib import Path
from dotenv import load_dotenv
from .base import *
from datetime import datetime

# .envを読み込む
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

# 環境変数を取得
environment = os.getenv("DJANGO_ENV", "development")

if environment == "production":
    from .production import *
else:
    from .local import *

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False") == "True"

# Postgres DB
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": "5432",
        "OPTIONS": {
            "client_encoding": "UTF8",
        },
    }
}

# ログファイルのディレクトリを作成
LOG_DIR = os.path.join(BASE_DIR, "logs")
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# ログファイル名に日付を含める
LOG_FILE = os.path.join(LOG_DIR, f"app_{datetime.now().strftime('%Y%m%d')}.log")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",  # ログローテーションを使用
            "filename": LOG_FILE,
            "maxBytes": 1024 * 1024 * 5,  # 5MB
            "backupCount": 5,  # 5世代まで保持
            "formatter": "verbose",
        },
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file", "console"],
            "level": "INFO",
            "propagate": True,
        },
        "app": {  # アプリケーション固有のログ
            "handlers": ["file", "console"],
            "level": "INFO",
            "propagate": True,
        },
    },
}
