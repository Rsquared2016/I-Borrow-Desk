from functools import wraps
from flask import (
    abort,
    current_app,
    url_for,
)
from flask_jwt_extended import get_jwt_identity
from itsdangerous import URLSafeTimedSerializer

from .models import get_user

def require_subscription(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = get_user(get_jwt_identity())
        if user.subscribed:
            return fn(*args, **kwargs)
        else:
            abort(404)

    return wrapper


def user_loader(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        user = get_user(identity) if identity else None
        return fn(*args, user=user, **kwargs)

    return wrapper


CSV_TOKEN_SALT = 'oiaen34enesrast'


def csv_download_link(symbol):
    ts = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = ts.dumps(symbol, salt=CSV_TOKEN_SALT)
    return url_for('api_bp.csv_historical_report', token=token)