import hashlib
import uuid

from django.conf import settings


def generate_token() -> str:
    """URLに載せるランダムトークン（平文）を生成する。"""
    return str(uuid.uuid4())


def hash_token(raw_token: str) -> str:
    """平文トークンをハッシュ化して保存用にする。

    SECRET_KEY をペッパーとして SHA-256 でハッシュ。
    """
    secret = getattr(settings, "SECRET_KEY", "")
    data = (raw_token + secret).encode("utf-8")
    return hashlib.sha256(data).hexdigest()
