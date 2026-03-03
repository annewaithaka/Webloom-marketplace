from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required

from app.models.admin_user import AdminUser

admin_auth_bp = Blueprint("admin_auth", __name__, url_prefix="/auth")


def _admin_claims(admin: AdminUser) -> dict:
    return {"typ": "admin", "role": admin.role}


@admin_auth_bp.post("/login")
def admin_login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    admin = AdminUser.query.filter_by(email=email, is_active=True).first()
    if not admin or not admin.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(admin.id), additional_claims=_admin_claims(admin))
    return jsonify({
        "access_token": token,
        "admin": {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role},
    }), 200


@admin_auth_bp.get("/me")
@jwt_required()
def admin_me():
    claims = get_jwt() or {}
    if claims.get("typ") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    admin_id = int(get_jwt_identity())
    admin = AdminUser.query.get(admin_id)
    if not admin or not admin.is_active:
        return jsonify({"error": "Admin not found"}), 404

    return jsonify({"admin": {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role}}), 200
