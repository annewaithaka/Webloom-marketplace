# app/modules/marketplace/routes.py
import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.client import Client
from app.models.organization import Organization
from app.models.product import Product
from app.models.plan import Plan

marketplace_bp = Blueprint("marketplace", __name__)


def _safe_json(text: str | None):
    if not text:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return text


# -----------------------
# Organizations (protected)
# -----------------------
@marketplace_bp.get("/organizations")
@jwt_required()
def list_organizations():
    user_id = int(get_jwt_identity())
    client = Client.query.filter_by(owner_user_id=user_id).first()

    if not client:
        return jsonify({"error": "Client account not found for this user"}), 404

    orgs = Organization.query.filter_by(client_id=client.id).order_by(Organization.created_at.desc()).all()

    return jsonify(
        {
            "organizations": [
                {
                    "id": o.id,
                    "organization_name": o.organization_name,
                    "organization_owner": o.organization_owner,
                    "organization_status": o.organization_status,
                    "organization_id": o.organization_id,
                    "created_at": o.created_at.isoformat(),
                }
                for o in orgs
            ]
        }
    ), 200


@marketplace_bp.post("/organizations")
@jwt_required()
def create_organization():
    user_id = int(get_jwt_identity())
    client = Client.query.filter_by(owner_user_id=user_id).first()

    if not client:
        return jsonify({"error": "Client account not found for this user"}), 404

    data = request.get_json(silent=True) or {}
    organization_name = (data.get("organization_name") or "").strip()
    organization_owner = (data.get("organization_owner") or "").strip()

    if not organization_name or not organization_owner:
        return jsonify({"error": "organization_name and organization_owner are required"}), 400

    org = Organization(
        client_id=client.id,
        organization_name=organization_name,
        organization_owner=organization_owner,
    )

    db.session.add(org)
    db.session.commit()

    return jsonify(
        {
            "message": "Organization created",
            "organization": {
                "id": org.id,
                "organization_name": org.organization_name,
                "organization_owner": org.organization_owner,
                "organization_status": org.organization_status,
                "organization_id": org.organization_id,
            },
        }
    ), 201


# -----------------------
# Products + Plans (public)
# -----------------------
@marketplace_bp.get("/products")
def list_products():
    products = Product.query.filter_by(is_active=True).order_by(Product.created_at.desc()).all()
    return jsonify(
        {
            "products": [
                {
                    "id": p.id,
                    "name": p.name,
                    "slug": p.slug,
                    "description": p.description,
                }
                for p in products
            ]
        }
    ), 200


@marketplace_bp.get("/products/<string:slug>/plans")
def list_plans(slug: str):
    product = Product.query.filter_by(slug=slug, is_active=True).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    plans = Plan.query.filter_by(product_id=product.id, is_active=True).order_by(Plan.price.asc()).all()

    return jsonify(
        {
            "product": {"id": product.id, "name": product.name, "slug": product.slug},
            "plans": [
                {
                    "id": pl.id,
                    "name": pl.name,
                    "price": pl.price,
                    "duration_days": pl.duration_days,
                    "features": _safe_json(pl.features),
                }
                for pl in plans
            ],
        }
    ), 200
