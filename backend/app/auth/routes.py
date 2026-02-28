# app/auth/routes.py 
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.user import User
from app.models.client import Client
from app.utils.email_tokens import make_email_token, read_email_token
from app.utils.email_utils import send_verification_email

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

VERIFY_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24  # 24 hours


def _verification_link(token: str) -> str:
    base = request.host_url.rstrip("/")
    return f"{base}/auth/verify-email?token={token}"


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    owner_name = (data.get("owner_name") or data.get("name") or "").strip()
    business_name = (data.get("business_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    password = data.get("password") or ""

    if not owner_name or not email or not phone or not password:
        return jsonify({"error": "owner_name (or name), email, phone, password are required"}), 400

    if not business_name:
        business_name = f"{owner_name}'s Business"

    if User.query.filter((User.email == email) | (User.phone == phone)).first():
        return jsonify({"error": "User with that email or phone already exists"}), 409

    user = User(name=owner_name, email=email, phone=phone, role="client")
    user.set_password(password)
    user.email_verified = False

    db.session.add(user)
    db.session.flush()

    client = Client(owner_user_id=user.id, business_name=business_name, status="active")
    db.session.add(client)
    db.session.commit()

    token = make_email_token(current_app.config["SECRET_KEY"], email)
    send_verification_email(email, _verification_link(token))

    return jsonify(
        {
            "message": "Registered. Please verify your email.",
            "user_id": user.id,
            "client_id": client.id,
        }
    ), 201


@auth_bp.get("/verify-email")
def verify_email():
    token = (request.args.get("token") or "").strip()
    if not token:
        return jsonify({"error": "token is required"}), 400

    email = read_email_token(current_app.config["SECRET_KEY"], token, VERIFY_TOKEN_MAX_AGE_SECONDS)
    if not email:
        return jsonify({"error": "Invalid or expired token"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.email_verified:
        return jsonify({"message": "Email already verified"}), 200

    user.email_verified = True
    db.session.commit()

    return jsonify({"message": "Email verified. You can now log in."}), 200


@auth_bp.post("/resend-verification")
def resend_verification():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    if not email:
        return jsonify({"error": "email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.email_verified:
        return jsonify({"message": "Email already verified"}), 200

    token = make_email_token(current_app.config["SECRET_KEY"], email)
    send_verification_email(email, _verification_link(token))

    return jsonify({"message": "Verification email resent"}), 200


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    if not user.email_verified:
        return jsonify({"error": "Please verify your email before logging in"}), 403

    token = create_access_token(identity=str(user.id))
    return jsonify(
        {
            "access_token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "email_verified": user.email_verified,
            },
        }
    ), 200
    