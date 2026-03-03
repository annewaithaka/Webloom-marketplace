import json
from flask import Blueprint, jsonify, request
from sqlalchemy import and_, func

from app.extensions import db
from app.admin.access_control import require_roles
from app.models.audit_log import AuditLog
from app.models.admin_user import AdminUser

admin_audit_bp = Blueprint("admin_audit", __name__, url_prefix="/audit")


def _to_int(val, default: int) -> int:
    try:
        return int(val)
    except (TypeError, ValueError):
        return default


@admin_audit_bp.get("")
@require_roles(["SUPPORT", "FINANCE"])
def list_audit_logs():
    """
    GET /admin/audit?q=&action=&entity_type=&page=&page_size=
    """
    q = (request.args.get("q") or "").strip().lower()
    action = (request.args.get("action") or "").strip()
    entity_type = (request.args.get("entity_type") or "").strip()

    page = max(_to_int(request.args.get("page"), 1), 1)
    page_size = min(max(_to_int(request.args.get("page_size"), 20), 1), 100)

    base = db.session.query(AuditLog, AdminUser).join(AdminUser, AdminUser.id == AuditLog.actor_admin_id)

    if action:
        base = base.filter(AuditLog.action == action)

    if entity_type:
        base = base.filter(AuditLog.entity_type == entity_type)

    if q:
        like = f"%{q}%"
        base = base.filter(
            and_(
                func.lower(AuditLog.entity_id).like(like) | func.lower(AuditLog.entity_type).like(like) | func.lower(AuditLog.action).like(like),
            )
        )

    total = base.count()
    total_pages = (total + page_size - 1) // page_size if page_size else 0

    rows = (
        base.order_by(AuditLog.created_at.desc())
        .limit(page_size)
        .offset((page - 1) * page_size)
        .all()
    )

    items = []
    for log, admin in rows:
        items.append(
            {
                "id": log.id,
                "created_at": log.created_at.isoformat() if log.created_at else None,
                "actor": {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role},
                "action": log.action,
                "entity_type": log.entity_type,
                "entity_id": log.entity_id,
                "before": json.loads(log.before_json) if log.before_json else None,
                "after": json.loads(log.after_json) if log.after_json else None,
                "ip": log.ip,
                "user_agent": log.user_agent,
            }
        )

    return jsonify({"items": items, "page": page, "page_size": page_size, "total": total, "total_pages": total_pages}), 200
