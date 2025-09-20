import re
import unicodedata

from django.utils.html import strip_tags


CONTROL_CHARS_PATTERN = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")


def _normalize_text(value: str) -> str:
    # Unicode 正規化（互換分解→合成）
    normalized = unicodedata.normalize("NFKC", value)
    # 制御文字の除去（改行・タブは保持）
    no_controls = CONTROL_CHARS_PATTERN.sub("", normalized)
    # 改行コードの正規化
    return no_controls.replace("\r\n", "\n").replace("\r", "\n")


def sanitize_string(value: str, max_length: int | None = None) -> str:
    if value is None:
        return value
    text = str(value)
    text = _normalize_text(text)
    # HTMLタグの除去
    text = strip_tags(text)
    # 前後空白の除去
    text = text.strip()
    if max_length is not None and max_length > 0:
        text = text[:max_length]
    return text


def sanitize_email(value: str) -> str:
    if value is None:
        return value
    text = str(value)
    text = _normalize_text(text)
    text = text.strip()
    # メールは大文字小文字を区別しないので小文字化
    return text.lower()


def sanitize_password(value: str) -> str:
    if value is None:
        return value
    # パスワードは意味を変えない範囲でのみサニタイズ
    text = str(value)
    text = unicodedata.normalize("NFKC", text)
    # ヌル文字等のみ除去（空白や記号は保持）
    text = CONTROL_CHARS_PATTERN.sub("", text)
    # 改行コードの正規化
    return text.replace("\r\n", "\n").replace("\r", "\n")
