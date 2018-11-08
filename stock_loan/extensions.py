import os
import memcache
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_ipaddr
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from .borrow import Borrow

sentry_sdk.init(
    dsn=os.getenv('SENTRY_KEY').strip(),
    integrations=[FlaskIntegration()],
    environment=os.getenv('APP_ENV').strip(),
)
db = SQLAlchemy()
limiter = Limiter(key_func=get_ipaddr)
login_manager = LoginManager()
jwt_manager = JWTManager()
mailer = Mail()
migrate = Migrate()
stock_loan = Borrow(database_name='stock_loan', create_new=False)
mc = memcache.Client(['127.0.0.1:11211'], debug=0)
mc.flush_all()
