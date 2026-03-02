# =========================================
# FILE: webloom-marketplace-backend/seed.py
# =========================================
import json

from app import create_app
from app.extensions import db
from app.models.product import Product
from app.models.plan import Plan


def upsert_product(slug: str, name: str, description: str | None):
    product = Product.query.filter_by(slug=slug).first()
    if product:
        product.name = name
        product.description = description
        product.is_active = True
        return product

    product = Product(slug=slug, name=name, description=description, is_active=True)
    db.session.add(product)
    db.session.flush()
    return product


def upsert_plan(
    product_id: int,
    name: str,
    monthly_fee_kes: int,
    duration_days: int,
    features: dict,
    setup_fee_kes: int = 0,
):
    plan = Plan.query.filter_by(product_id=product_id, name=name).first()
    payload = json.dumps(features)

    if plan:
        plan.monthly_fee_kes = monthly_fee_kes
        plan.setup_fee_kes = setup_fee_kes

        # Keep old `price` aligned for any existing code paths.
        plan.price = monthly_fee_kes

        plan.duration_days = duration_days
        plan.features = payload
        plan.is_active = True
        return plan

    plan = Plan(
        product_id=product_id,
        name=name,
        monthly_fee_kes=monthly_fee_kes,
        setup_fee_kes=setup_fee_kes,
        price=monthly_fee_kes,  # back-compat
        duration_days=duration_days,
        features=payload,
        is_active=True,
    )
    db.session.add(plan)
    return plan


def main():
    app = create_app()
    with app.app_context():
        azani = upsert_product(
            slug="azani",
            name="Azani Smart Duka",
            description="SMART Business Management and POS system.",
        )

        setup_fee = 10000  # one-time setup

        upsert_plan(
            product_id=azani.id,
            name="Free Trial (14 days)",
            monthly_fee_kes=0,
            setup_fee_kes=0,
            duration_days=14,
            features={"trial": True, "branches": 1, "support": "basic"},
        )
        upsert_plan(
            product_id=azani.id,
            name="Starter",
            monthly_fee_kes=2500,
            setup_fee_kes=setup_fee,
            duration_days=30,
            features={"branches": 1, "support": "standard"},
        )
        upsert_plan(
            product_id=azani.id,
            name="Pro",
            monthly_fee_kes=5000,
            setup_fee_kes=setup_fee,
            duration_days=30,
            features={"branches": 3, "support": "priority"},
        )
        upsert_plan(
            product_id=azani.id,
            name="Enterprise",
            monthly_fee_kes=12000,
            setup_fee_kes=setup_fee,
            duration_days=30,
            features={"branches": 10, "support": "dedicated"},
        )

        db.session.commit()
        print("✅ Seed complete: Azani + plans inserted/updated")


if __name__ == "__main__":
    main()
    