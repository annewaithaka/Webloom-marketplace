# app/models/client.py 
from datetime import datetime

from app.extensions import db


class Client(db.Model):
    __tablename__ = "clients"

    id = db.Column(db.Integer, primary_key=True)
    owner_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)

    business_name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="active")  # active/inactive

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
