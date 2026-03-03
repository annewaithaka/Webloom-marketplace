import csv
import io
from datetime import datetime

from flask import Blueprint, Response, jsonify, request
from sqlalchemy import or_, func

from app.extensions import db
from app.admin.access_control import require_roles
from app.models.admin_user import AdminUser
from app.models.client import Client
from app.models.onboarding_payment import OnboardingPayment
from app.models.user import User
from flask_jwt_extended import get_jwt_identity
from app.utils.audit import log_admin_action

admin_onboarding_payments_bp = Blueprint(
    "admin_onboarding_payments",
    __name__,
    url_prefix="/onboarding-payments",
)


def _to_int(val, default: int) -> int:
    try:
        return int(val)
    except (TypeError, ValueError):
        return default


def _row(payment: OnboardingPayment, client: Client, owner: User | None, created_by: AdminUser | None, confirmed_by: AdminUser | None, rejected_by: AdminUser | None) -> dict:
    return {
        "id": payment.id,
        "client_id": payment.client_id,
        "amount_kes": payment.amount_kes,
        "currency": payment.currency,
        "status": payment.status,
        "method": payment.method,
        "reference": payment.reference,
        "notes": payment.notes,
        "created_at": payment.created_at.isoformat() if payment.created_at else None,
        "confirmed_at": payment.confirmed_at.isoformat() if payment.confirmed_at else None,
        "rejected_at": payment.rejected_at.isoformat() if payment.rejected_at else None,
        "client": {
            "id": client.id,
            "business_name": client.business_name,
            "account_status": client.account_status,
            "owner_user_id": client.owner_user_id,
        } if client else None,
        "owner": {
            "id": owner.id,
            "name": owner.name,
            "email": owner.email,
            "phone": owner.phone,
        } if owner else None,
        "created_by": {"id": created_by.id, "name": created_by.name, "email": created_by.email, "role": created_by.role} if created_by else None,
        "confirmed_by": {"id": confirmed_by.id, "name": confirmed_by.name, "email": confirmed_by.email, "role": confirmed_by.role} if confirmed_by else None,
        "rejected_by": {"id": rejected_by.id, "name": rejected_by.name, "email": rejected_by.email, "role": rejected_by.role} if rejected_by else None,
    }


@admin_onboarding_payments_bp.post("")
@require_roles(["FINANCE"])
def create_payment():
    """
    POST /admin/onboarding-payments
    Body: { client_id, amount_kes, method?, reference?, notes? }
    """
    data = request.get_json(silent=True) or {}
    client_id = _to_int(data.get("client_id"), 0)
    amount_kes = _to_int(data.get("amount_kes"), 0)

    if client_id <= 0 or amount_kes <= 0:
        return jsonify({"error": "client_id and amount_kes are required (positive integers)"}), 400

    client = Client.query.get(client_id)
    if not client:
        return jsonify({"error": "Client not found"}), 404

    admin_id = int(get_jwt_identity())

    payment = OnboardingPayment(
        client_id=client.id,
        amount_kes=amount_kes,
        method=(data.get("method") or "").strip() or None,
        reference=(data.get("reference") or "").strip() or None,
        notes=(data.get("notes") or "").strip() or None,
        status="PENDING",
        created_by_admin_id=admin_id,
    )
    db.session.add(payment)
    db.session.flush()

    log_admin_action(
        actor_admin_id=admin_id,
        action="PAYMENT_RECORDED",
        entity_type="OnboardingPayment",
        entity_id=str(payment.id),
        before=None,
        after={"status": payment.status, "client_id": payment.client_id, "amount_kes": payment.amount_kes, "reference": payment.reference},
        request=request,
    )

    db.session.commit()

    return jsonify({"message": "Payment recorded", "payment_id": payment.id}), 201


@admin_onboarding_payments_bp.get("")
@require_roles(["SUPPORT", "FINANCE"])
def list_payments():
    """
    GET /admin/onboarding-payments?status=&q=&client_id=&page=&page_size=
    """
    status = (request.args.get("status") or "").strip().upper()
    q = (request.args.get("q") or "").strip()
    client_id = _to_int(request.args.get("client_id"), 0)

    page = max(_to_int(request.args.get("page"), 1), 1)
    page_size = _to_int(request.args.get("page_size"), 20)
    page_size = min(max(page_size, 1), 100)

    CreatedBy = db.aliased(AdminUser)
    ConfirmedBy = db.aliased(AdminUser)
    RejectedBy = db.aliased(AdminUser)

    base = (
        db.session.query(OnboardingPayment, Client, User, CreatedBy, ConfirmedBy, RejectedBy)
        .join(Client, Client.id == OnboardingPayment.client_id)
        .join(User, User.id == Client.owner_user_id)
        .outerjoin(CreatedBy, CreatedBy.id == OnboardingPayment.created_by_admin_id)
        .outerjoin(ConfirmedBy, ConfirmedBy.id == OnboardingPayment.confirmed_by_admin_id)
        .outerjoin(RejectedBy, RejectedBy.id == OnboardingPayment.rejected_by_admin_id)
    )

    if status:
        base = base.filter(OnboardingPayment.status == status)

    if client_id > 0:
        base = base.filter(OnboardingPayment.client_id == client_id)

    if q:
        like = f"%{q.lower()}%"
        base = base.filter(
            or_(
                func.lower(Client.business_name).like(like),
                func.lower(User.name).like(like),
                func.lower(User.email).like(like),
                func.lower(User.phone).like(like),
                func.lower(OnboardingPayment.reference).like(like),
            )
        )

    total = base.count()
    total_pages = (total + page_size - 1) // page_size if page_size else 0

    rows = (
        base.order_by(OnboardingPayment.created_at.desc())
        .limit(page_size)
        .offset((page - 1) * page_size)
        .all()
    )

    items = [
        _row(p, c, o, cb, confb, rb)
        for (p, c, o, cb, confb, rb) in rows
    ]

    return jsonify({"items": items, "page": page, "page_size": page_size, "total": total, "total_pages": total_pages}), 200


@admin_onboarding_payments_bp.post("/<int:payment_id>/confirm")
@require_roles(["FINANCE"])
def confirm_payment(payment_id: int):
    """
    POST /admin/onboarding-payments/<id>/confirm
    Body: { auto_activate?: bool }
    """
    data = request.get_json(silent=True) or {}
    auto_activate = bool(data.get("auto_activate", True))

    payment = OnboardingPayment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    if payment.status == "CONFIRMED":
        return jsonify({"message": "Already confirmed"}), 200
    if payment.status == "REJECTED":
        return jsonify({"error": "Cannot confirm a rejected payment"}), 409

    admin_id = int(get_jwt_identity())

    before = {"status": payment.status}

    payment.status = "CONFIRMED"
    payment.confirmed_by_admin_id = admin_id
    payment.confirmed_at = datetime.utcnow()
    payment.rejected_by_admin_id = None
    payment.rejected_at = None

    client = Client.query.get(payment.client_id)
    if client and auto_activate:
        client.account_status = "ACTIVE"
        client.updated_at = datetime.utcnow()

    log_admin_action(
        actor_admin_id=admin_id,
        action="PAYMENT_CONFIRMED",
        entity_type="OnboardingPayment",
        entity_id=str(payment.id),
        before=before,
        after={"status": payment.status, "auto_activated": auto_activate},
        request=request,
    )

    db.session.commit()

    return jsonify({"message": "Payment confirmed", "auto_activated": auto_activate}), 200


@admin_onboarding_payments_bp.post("/<int:payment_id>/reject")
@require_roles(["FINANCE"])
def reject_payment(payment_id: int):
    """
    POST /admin/onboarding-payments/<id>/reject
    Body: { reason?: str }
    """
    data = request.get_json(silent=True) or {}
    reason = (data.get("reason") or "").strip() or None

    payment = OnboardingPayment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    if payment.status == "REJECTED":
        return jsonify({"message": "Already rejected"}), 200
    if payment.status == "CONFIRMED":
        return jsonify({"error": "Cannot reject a confirmed payment"}), 409

    admin_id = int(get_jwt_identity())

    before = {"status": payment.status}

    payment.status = "REJECTED"
    payment.rejected_by_admin_id = admin_id
    payment.rejected_at = datetime.utcnow()
    payment.confirmed_by_admin_id = None
    payment.confirmed_at = None

    if reason:
        existing = (payment.notes or "").strip()
        payment.notes = existing + ("\\n" if existing else "") + f"REJECT_REASON: {reason}"

    log_admin_action(
        actor_admin_id=admin_id,
        action="PAYMENT_REJECTED",
        entity_type="OnboardingPayment",
        entity_id=str(payment.id),
        before=before,
        after={"status": payment.status},
        request=request,
    )

    db.session.commit()

    return jsonify({"message": "Payment rejected"}), 200


@admin_onboarding_payments_bp.get("/export.csv")
@require_roles(["SUPPORT", "FINANCE"])
def export_csv():
    """
    GET /admin/onboarding-payments/export.csv?status=&q=&client_id=
    """
    status = (request.args.get("status") or "").strip().upper()
    q = (request.args.get("q") or "").strip()
    client_id = _to_int(request.args.get("client_id"), 0)

    base = (
        db.session.query(OnboardingPayment, Client, User)
        .join(Client, Client.id == OnboardingPayment.client_id)
        .join(User, User.id == Client.owner_user_id)
    )

    if status:
        base = base.filter(OnboardingPayment.status == status)
    if client_id > 0:
        base = base.filter(OnboardingPayment.client_id == client_id)
    if q:
        like = f"%{q.lower()}%"
        base = base.filter(
            or_(
                func.lower(Client.business_name).like(like),
                func.lower(User.name).like(like),
                func.lower(User.email).like(like),
                func.lower(User.phone).like(like),
                func.lower(OnboardingPayment.reference).like(like),
            )
        )

    rows = base.order_by(OnboardingPayment.created_at.desc()).all()

    out = io.StringIO()
    w = csv.writer(out)
    w.writerow([
        "payment_id",
        "client_id",
        "business_name",
        "owner_name",
        "owner_email",
        "owner_phone",
        "amount_kes",
        "currency",
        "status",
        "method",
        "reference",
        "created_at",
        "confirmed_at",
        "rejected_at",
    ])

    for p, c, u in rows:
        w.writerow([
            p.id,
            c.id,
            c.business_name,
            u.name,
            u.email,
            u.phone,
            p.amount_kes,
            p.currency,
            p.status,
            p.method or "",
            p.reference or "",
            p.created_at.isoformat() if p.created_at else "",
            p.confirmed_at.isoformat() if p.confirmed_at else "",
            p.rejected_at.isoformat() if p.rejected_at else "",
        ])

    csv_data = out.getvalue()
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=onboarding_payments.csv"},
    )
