# app/models/plan.py 
from datetime import datetime

from app.extensions import db


class Plan(db.Model):
    __tablename__ = "plans"

    id = db.Column(db.Integer, primary_key=True)

    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False, index=True)

    name = db.Column(db.String(120), nullable=False)  # Trial/Starter/Pro/Enterprise
    price = db.Column(db.Integer, nullable=False, default=0)  # store as integer (KES) for now
    duration_days = db.Column(db.Integer, nullable=False, default=30)
    features = db.Column(db.Text, nullable=True)  # JSON string for now (simple), later use JSON in Postgres

    is_active = db.Column(db.Boolean, nullable=False, default=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
