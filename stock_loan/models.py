import enum
from sqlalchemy.sql.functions import now
from werkzeug import generate_password_hash, check_password_hash

from .extensions import db, stock_loan


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(250))
    receive_email = db.Column(db.Boolean, index=True)
    admin = db.Column(db.Boolean)
    views = db.Column(db.Integer, default=0)
    last_login = db.Column(db.DateTime, nullable=True)
    confirmed_at = db.Column(db.DateTime, nullable=True)

    def __init__(self, username, password, email, receive_email=True, admin=False):
        self.username = username
        self.set_password(password)
        self.email = email
        self.receive_email = receive_email
        self.admin = admin
        self.views = 0
        self.last_login = now()

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def confirm(self):
        self.confirmed_at = now()

    @property
    def is_active(self):
        return True

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    @property
    def is_admin(self):
        return self.admin

    @property
    def watchlist(self):
        return stock_loan.get_watchlist(self.id)

    def increment_views(self):
        self.views += 1

    @property
    def subscribed(self):
        return any(subscription.expired_at is None for subscription in self.subscriptions)


    def __repr__(self):
        return '{}'.format(self.username)


def get_user(username):
    user = User.query.filter_by(username=username).one()
    user.last_login = now()
    user.increment_views()
    db.session.add(user)
    db.session.commit()
    return user


class SubscriptionEnum(enum.Enum):
    patreon_standard = 1
    patreon_premium = 1


class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('subscriptions', lazy=True))
    package = db.Column(db.Enum(SubscriptionEnum), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=now())
    expired_at = db.Column(db.DateTime(timezone=True))
