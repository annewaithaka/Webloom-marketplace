from datetime import datetime

from app.extensions import db


class OnboardingPayment(db.Model):
    __tablename__ = "onboarding_payments"

    id = db.Column(db.Integer, primary_key=True)

    client_id = db.Column(db.Integer, db.ForeignKey("clients.id"), nullable=False, index=True)

    amount_kes = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(8), nullable=False, default="KES")

    status = db.Column(
        db.String(16),
        nullable=False,
        default="PENDING",  # PENDING / CONFIRMED / REJECTED
        index=True,
    )

    method = db.Column(db.String(32), nullable=True)  # mpesa/bank/cash/manual
    reference = db.Column(db.String(128), nullable=True, index=True)  # mpesa code, bank ref, receipt
    notes = db.Column(db.Text, nullable=True)

    created_by_admin_id = db.Column(db.Integer, db.ForeignKey("admin_users.id"), nullable=False, index=True)
    confirmed_by_admin_id = db.Column(db.Integer, db.ForeignKey("admin_users.id"), nullable=True, index=True)
    rejected_by_admin_id = db.Column(db.Integer, db.ForeignKey("admin_users.id"), nullable=True, index=True)

    confirmed_at = db.Column(db.DateTime, nullable=True)
    rejected_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
