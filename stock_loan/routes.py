import os
import logging

from flask import render_template, request, redirect, flash, Blueprint, \
    current_app
from flask_login import login_user, logout_user, current_user, login_required
from flask_admin import BaseView, expose
from flask_admin.contrib.sqla import ModelView
from itsdangerous import URLSafeTimedSerializer
from werkzeug.exceptions import NotFound


from .extensions import login_manager, limiter, db
from .models import User


dirname, filename = os.path.split(os.path.abspath(__file__))
logging.basicConfig()
login_manager.login_view = 'login'


class AdminView(BaseView):
    def is_accessible(self):
        if current_user.is_authenticated:
            return current_user.is_admin
        else:
            return False

    def _handle_view(self, name, **kwargs):
        if not self.is_accessible():
            raise NotFound

    @expose('/')
    def index(self):
        if not self.is_accessible():
            raise NotFound
        else:
            return self.render('admin_homepage_template.html')


class UserView(ModelView):
    def is_accessible(self):
        if current_user.is_authenticated:
            return current_user.is_admin
        else:
            return False

    def _handle_view(self, name, **kwargs):
        if not self.is_accessible():
            raise NotFound

    column_list = (
        'username', 'email', 'receive_email', 'admin', 'views', 'last_login', 'watchlist',
    )

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


@templated_bp.route('/admin_login', methods=['GET', 'POST'])
@limiter.limit("30 per hour")
@limiter.limit("10 per minute")
def admin_login():
    """Login page handler"""
    if request.method == 'GET':
        return render_template('login_template.html')

    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()

    if user is None or not user.check_password(password):
        raise NotFound
    if not user.is_admin:
        raise NotFound

    # Flask login
    login_user(user)
    flash('Welcome {}!'.format(user.username))
    return redirect('/admin')


@templated_bp.route('/admin_logout')
@login_required
def admin_logout():
    logout_user()
    return 'logged out', 200


@templated_bp.route('/confirm_email/<token>')
def confirm_email(token):
    ts = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = ts.loads(token, salt='email-confirm-key')
    except:
        return 'Not Found', 404

    user = User.query.filter_by(email=email).first_or_404()
    user.confirm()
    db.session.add(user)
    db.session.commit()

    return render_template('email_confirmed.html')
