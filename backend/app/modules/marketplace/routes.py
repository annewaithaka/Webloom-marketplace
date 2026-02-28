# app/modules/marketplace/routes.py 
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.client import Client
from app.models.organization import Organization

marketplace_bp = Blueprint("marketplace", __name__)


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
