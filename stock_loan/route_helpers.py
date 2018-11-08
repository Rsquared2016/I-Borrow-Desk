from functools import wraps
from flask import abort
from flask_jwt_extended import get_jwt_identity
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
        user = get_user(get_jwt_identity())
        return fn(*args, user=user, **kwargs)

    return wrapper