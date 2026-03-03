import json
from typing import Any

from flask import Request

from app.extensions import db
from app.models.audit_log import AuditLog


def _safe_json(value: Any) -> str | None:
    if value is None:
        return None
    try:
        return json.dumps(value, ensure_ascii=False, default=str)
    except Exception:
        return json.dumps({"_unserializable": str(value)}, ensure_ascii=False)


def log_admin_action(
    *,
    actor_admin_id: int,
    action: str,
    entity_type: str,
    entity_id: str,
    before: Any = None,
    after: Any = None,
    request: Request | None = None,
) -> None:
    ip = None
    user_agent = None
    if request is not None:
        ip = request.headers.get("X-Forwarded-For", request.remote_addr)
        user_agent = (request.headers.get("User-Agent") or "")[:255] or None

    row = AuditLog(
        actor_admin_id=actor_admin_id,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        before_json=_safe_json(before),
        after_json=_safe_json(after),
        ip=ip,
        user_agent=user_agent,
    )
    db.session.add(row)
