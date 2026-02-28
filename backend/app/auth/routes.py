# app/auth/routes.py 
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.user import User
from app.models.client import Client

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    # Accept both formats:
    # - old: name
    # - new: owner_name + business_name
    owner_name = (data.get("owner_name") or data.get("name") or "").strip()
    business_name = (data.get("business_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    password = data.get("password") or ""

    if not owner_name or not email or not phone or not password:
        return jsonify({"error": "owner_name (or name), email, phone, password are required"}), 400

    if not business_name:
        # Allow missing business_name for now, but strongly recommended (you can enforce later)
        business_name = f"{owner_name}'s Business"

    if User.query.filter((User.email == email) | (User.phone == phone)).first():
        return jsonify({"error": "User with that email or phone already exists"}), 409

    user = User(name=owner_name, email=email, phone=phone, role="client")
    user.set_password(password)

    db.session.add(user)
    db.session.flush()  # get user.id without committing yet

    client = Client(owner_user_id=user.id, business_name=business_name, status="active")
    db.session.add(client)
    db.session.commit()

    return jsonify(
        {
            "message": "Registered",
            "user_id": user.id,
            "client_id": client.id,
            "business_name": client.business_name,
        }
    ), 201


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

