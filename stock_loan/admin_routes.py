from flask import (
    request,
    render_template,
    flash,
    redirect,
)
from flask_admin import (
    BaseView,
    expose,
)
from flask_admin.contrib.sqla import ModelView
from flask_login import (
    current_user,
    login_user,
    login_required,
    logout_user,
)
from werkzeug.exceptions import NotFound

from .extensions import limiter
from .models import User
from .routes import templated_bp


class AuthMixin:
    def is_accessible(self):
        if current_user.is_authenticated:
            return current_user.is_admin
        else:
            return False

    def _handle_view(self, name, **kwargs):
        if not self.is_accessible():
            raise NotFound


class AdminView(AuthMixin, BaseView):
    @expose('/')
    def index(self):
        if not self.is_accessible():
            raise NotFound
        else:
            return self.render('admin_homepage_template.html')


class UserView(AuthMixin, ModelView):
    column_auto_select_related = True

    column_list = (
        'username',
        'email',
        'receive_email',
        'admin',
        'views',
        'last_login',
        'watchlist',
        'confirmed_at',
    )


class SubscriptionView(AuthMixin, ModelView):
    column_list = (
        'user',
        'package',
        'created_at',
        'updated_at',
        'expired_at',
    )


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