# app/utils/access_control.py
from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from app.models.client import Client


def require_active_client(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = int(get_jwt_identity())
        client = Client.query.filter_by(owner_user_id=user_id).first()

        if not client:
            return jsonify({"error": "Client account not found for this user"}), 404

        if client.account_status != "ACTIVE":
            return jsonify({"error": "Setup payment required", "account_status": client.account_status}), 403

        return fn(*args, **kwargs)

    return wrapper
    