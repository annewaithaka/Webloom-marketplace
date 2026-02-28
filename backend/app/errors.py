# -------------------------
# app/errors.py
# -------------------------
from flask import jsonify


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(400)
    def bad_request(err):
        msg = getattr(err, "description", "Bad request")
        return jsonify({"error": msg}), 400

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"error": "Server error"}), 500
