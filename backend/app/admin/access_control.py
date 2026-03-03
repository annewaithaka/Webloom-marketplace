from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from app.models.admin_user import AdminUser


def require_admin_auth(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt() or {}
        if claims.get("typ") != "admin":
            return jsonify({"error": "Forbidden"}), 403

        admin_id = int(get_jwt_identity())
        admin = AdminUser.query.get(admin_id)
        if not admin or not admin.is_active:
            return jsonify({"error": "Forbidden"}), 403

        return fn(*args, **kwargs)

    return wrapper


def require_roles(roles: list[str]):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt() or {}
            if claims.get("typ") != "admin":
                return jsonify({"error": "Forbidden"}), 403

            role = claims.get("role")
            if role != "SUPER_ADMIN" and role not in roles:
                return jsonify({"error": "Forbidden"}), 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator
