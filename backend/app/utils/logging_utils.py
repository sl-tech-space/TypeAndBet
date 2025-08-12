from __future__ import annotations

from typing import Optional


def mask_email(email: Optional[str]) -> str:
    if not email:
        return ""
    try:
        local, domain = email.split("@", 1)
    except ValueError:
        return "***"
    masked_local = (local[:2] + "***") if len(local) >= 2 else "***"
    # ドメインはラベルに分割して一部マスク
    parts = domain.split(".")
    if not parts:
        return f"{masked_local}@***"
    first = parts[0]
    masked_first = (first[:2] + "***") if len(first) >= 2 else "***"
    rest = ".".join(parts[1:])
    masked_domain = masked_first if not rest else f"{masked_first}.{rest}"
    return f"{masked_local}@{masked_domain}"


def mask_token(token: Optional[str]) -> str:
    if not token:
        return ""
    return token[:8] + "..." if len(token) > 8 else token
