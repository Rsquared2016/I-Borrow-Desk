import os
import logging

from flask import (
    render_template,
    Blueprint,
    current_app,
)
from itsdangerous import URLSafeTimedSerializer

from .auth.email import EMAIL_CONFIRM_SALT
from .extensions import (
    login_manager,
    db,
)
from .models import User


dirname, filename = os.path.split(os.path.abspath(__file__))
logging.basicConfig()
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(userid):
    """Required function for Flask-Login"""
    return User.query.get(int(userid))


templated_bp = Blueprint('templated_bp', __name__, template_folder='templates')


@templated_bp.route('/', defaults={'path': ''})
@templated_bp.route('/<path:path>')
@templated_bp.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')


@templated_bp.route('/confirm_email/<token>')
def confirm_email(token):
    ts = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = ts.loads(token, salt=EMAIL_CONFIRM_SALT)
    except:
        return 'Not Found', 404

    user = User.query.filter_by(email=email).first_or_404()
    user.confirm()
    db.session.add(user)
    db.session.commit()

    return render_template('email_confirmed.html')
