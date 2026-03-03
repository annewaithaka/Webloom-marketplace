from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy import or_, func

from app.extensions import db
from app.models.client import Client
from app.models.user import User
from app.admin.access_control import require_roles
from app.utils.audit import log_admin_action
from flask_jwt_extended import get_jwt_identity

admin_clients_bp = Blueprint("admin_clients", __name__, url_prefix="/clients")


def _to_int(val, default: int) -> int:
    try:
        return int(val)
    except (TypeError, ValueError):
        return default


def _client_row(client: Client, user: User | None) -> dict:
    return {
        "id": client.id,
        "owner_user_id": client.owner_user_id,
        "business_name": client.business_name,
        "status": client.status,
        "account_status": client.account_status,
        "created_at": client.created_at.isoformat() if client.created_at else None,
        "updated_at": client.updated_at.isoformat() if client.updated_at else None,
        "owner": (
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "email_verified": user.email_verified,
                "role": user.role,
            }
            if user
            else None
        ),
    }


@admin_clients_bp.get("")
@require_roles(["SUPPORT", "FINANCE"])
def list_clients():
    """
    GET /admin/clients?q=&account_status=&page=&page_size=
    """
    q = (request.args.get("q") or "").strip()
    account_status = (request.args.get("account_status") or "").strip().upper()

    page = max(_to_int(request.args.get("page"), 1), 1)
    page_size = _to_int(request.args.get("page_size"), 20)
    page_size = min(max(page_size, 1), 100)

    base = db.session.query(Client, User).join(User, User.id == Client.owner_user_id)

    if account_status:
        base = base.filter(Client.account_status == account_status)

    if q:
        like = f"%{q.lower()}%"
        base = base.filter(
            or_(
                func.lower(Client.business_name).like(like),
                func.lower(User.name).like(like),
                func.lower(User.email).like(like),
                func.lower(User.phone).like(like),
            )
        )

    total = base.count()
    total_pages = (total + page_size - 1) // page_size if page_size else 0

    rows = (
        base.order_by(Client.created_at.desc())
        .limit(page_size)
        .offset((page - 1) * page_size)
        .all()
    )

    return jsonify(
        {
            "items": [_client_row(c, u) for c, u in rows],
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
        }
    ), 200


@admin_clients_bp.get("/<int:client_id>")
@require_roles(["SUPPORT", "FINANCE"])
def get_client(client_id: int):
    row = (
        db.session.query(Client, User)
        .join(User, User.id == Client.owner_user_id)
        .filter(Client.id == client_id)
        .first()
    )
    if not row:
        return jsonify({"error": "Client not found"}), 404

    client, user = row
    return jsonify({"client": _client_row(client, user)}), 200


@admin_clients_bp.post("/<int:client_id>/activate")
@require_roles(["SUPPORT"])
def activate_client(client_id: int):
    client = Client.query.get(client_id)
    if not client:
        return jsonify({"error": "Client not found"}), 404

    client.account_status = "ACTIVE"
    client.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Client activated", "account_status": client.account_status}), 200


@admin_clients_bp.post("/<int:client_id>/suspend")
@require_roles(["SUPPORT"])
def suspend_client(client_id: int):
    client = Client.query.get(client_id)
    if not client:
        return jsonify({"error": "Client not found"}), 404

    client.account_status = "SUSPENDED"
    client.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Client suspended", "account_status": client.account_status}), 200
