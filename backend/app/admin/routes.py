from flask import Blueprint

from app.admin.auth.routes import admin_auth_bp
from app.admin.onboarding_payments.routes import admin_onboarding_payments_bp
from app.admin.clients.routes import admin_clients_bp

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")
admin_bp.register_blueprint(admin_auth_bp)
admin_bp.register_blueprint(admin_clients_bp)
admin_bp.register_blueprint(admin_onboarding_payments_bp)
