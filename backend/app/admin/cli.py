import click
from flask import Flask

from app.extensions import db
from app.models.admin_user import AdminUser


def register_admin_cli(app: Flask) -> None:
    @app.cli.command("create-super-admin")
    @click.option("--name", prompt=True)
    @click.option("--email", prompt=True)
    @click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
    def create_super_admin(name: str, email: str, password: str):
        """Create the first SUPER_ADMIN (one-time)."""
        email_norm = email.strip().lower()
        existing = AdminUser.query.filter_by(email=email_norm).first()
        if existing:
            click.echo("Admin with that email already exists.")
            return

        admin = AdminUser(name=name.strip(), email=email_norm, role="SUPER_ADMIN", is_active=True)
        admin.set_password(password)

        db.session.add(admin)
        db.session.commit()
        click.echo("✅ SUPER_ADMIN created")
