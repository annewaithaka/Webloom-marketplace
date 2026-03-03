from datetime import datetime

from app.extensions import db


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)

    actor_admin_id = db.Column(db.Integer, db.ForeignKey("admin_users.id"), nullable=False, index=True)

    action = db.Column(db.String(64), nullable=False, index=True)
    entity_type = db.Column(db.String(64), nullable=False, index=True)
    entity_id = db.Column(db.String(64), nullable=False, index=True)

    before_json = db.Column(db.Text, nullable=True)
    after_json = db.Column(db.Text, nullable=True)

    ip = db.Column(db.String(64), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)
