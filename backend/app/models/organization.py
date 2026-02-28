# app/models/organization.py
from datetime import datetime
import secrets

from app.extensions import db


def _generate_org_id() -> str:
    # short, unique-looking id for now; later can be replaced with your preferred format
    return "ORG-" + secrets.token_hex(4).upper()


class Organization(db.Model):
    __tablename__ = "organizations"

    id = db.Column(db.Integer, primary_key=True)

    client_id = db.Column(db.Integer, db.ForeignKey("clients.id"), nullable=False, index=True)

    organization_name = db.Column(db.String(255), nullable=False)
    organization_owner = db.Column(db.String(255), nullable=False)

    organization_status = db.Column(db.String(20), nullable=False, default="active")  # active/inactive
    organization_id = db.Column(db.String(40), nullable=False, unique=True, index=True, default=_generate_org_id)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
