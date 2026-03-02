from datetime import datetime

from app.extensions import db


class Plan(db.Model):
    __tablename__ = "plans"

    id = db.Column(db.Integer, primary_key=True)

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False,
        index=True,
    )

    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Integer, nullable=False, default=0)
    duration_days = db.Column(db.Integer, nullable=False, default=30)

    monthly_fee_kes = db.Column(db.Integer, nullable=False, default=0)
    setup_fee_kes = db.Column(db.Integer, nullable=False, default=0)

    features = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "product_id": self.product_id,
            "name": self.name,
            "price": self.price,
            "duration_days": self.duration_days,
            "monthly_fee_kes": self.monthly_fee_kes,
            "setup_fee_kes": self.setup_fee_kes,
            "features": self.features,
            "is_active": self.is_active,
        }
