# -------------------------
# app/config.py
# -------------------------
import os


def _get_env(name: str, default: str | None = None) -> str:
    val = os.getenv(name, default)
    if val is None or val == "":
        raise RuntimeError(f"Missing required env var: {name}")
    return val


class Config:
    SECRET_KEY = _get_env("SECRET_KEY", "change-me")
    JWT_SECRET_KEY = _get_env("JWT_SECRET_KEY", "change-me-too")
    SQLALCHEMY_DATABASE_URI = _get_env("DATABASE_URL", "sqlite:///webloom.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

