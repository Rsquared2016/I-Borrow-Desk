import datetime
import os

DEBUG = False
SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.getenv('DATABASE_PATH').strip()}"
DATABASE_CONNECT_OPTIONS = {}

# Application threads. A common general assumption is
# using 2 per available processor cores - to handle
# incoming requests using one and performing background
# operations using the other.
THREADS_PER_PAGE = 2

SECRET_KEY = os.getenv('SECRET_KEY').strip()
JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=24)
SQLALCHEMY_TRACK_MODIFICATIONS = False

MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_DEBUG = False
MAIL_USERNAME = 'iborrowdesk@gmail.com'
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD').strip()
MAIL_DEFAULT_SENDER = 'iborrowdesk@gmail.com'
