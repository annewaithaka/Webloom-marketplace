# app/__init__.py 
from flask import Flask, jsonify

from app.config import Config
from app.extensions import db, migrate, jwt, cors
from app.errors import register_error_handlers
from app.logging import configure_logging

from app.auth.routes import auth_bp
from app.modules.marketplace.routes import marketplace_bp

from app import models  # noqa: F401  (ensures models are imported for migrations)


def create_app() -> Flask:
    configure_logging()

    app = Flask(__name__)
    app.config.from_object(Config)

    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    register_error_handlers(app)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    app.register_blueprint(auth_bp)
    app.register_blueprint(marketplace_bp)

    return app
