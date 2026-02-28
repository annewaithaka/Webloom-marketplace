# app/utils/email_tokens.py
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired


def make_email_token(secret_key: str, email: str) -> str:
    s = URLSafeTimedSerializer(secret_key)
    return s.dumps({"email": email})


def read_email_token(secret_key: str, token: str, max_age_seconds: int) -> str | None:
    s = URLSafeTimedSerializer(secret_key)
    try:
        data = s.loads(token, max_age=max_age_seconds)
        return data.get("email")
    except (BadSignature, SignatureExpired):
        return None
        