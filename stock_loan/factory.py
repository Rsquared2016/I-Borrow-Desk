import logging
from logging import StreamHandler
from logging.handlers import SMTPHandler, QueueHandler, QueueListener
import queue

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask
from flask_admin import Admin

from .extensions import login_manager, limiter, db, jwt_manager, migrate, stock_loan
from .utils import refresh_borrow, email_job


apsched = BackgroundScheduler()
apsched.start()

# Add a job - morning emails
apsched.add_job(
    email_job, 'cron', day_of_week='mon-fri', hour='9', minute='4',
    timezone='America/New_York')

# Refresh trending stocks and collective stats on the hour
apsched.add_job(refresh_borrow, 'cron', minute='5', timezone='America/New_York')


def create_app(debug=False, refresh_stock_loan=True):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('config')
    app.config.from_pyfile('config.py')
    app.debug = debug

    login_manager.init_app(app)

    db.init_app(app)
    migrate.init_app(app, db)

    admin = Admin(name='IBorrowDesk', template_mode='bootstrap3')
    admin.init_app(app)

    from .routes import AdminView, UserView, templated_bp
    admin.add_view(AdminView(name='Home'))
    app.register_blueprint(templated_bp)

    from .api import api_bp
    app.register_blueprint(api_bp)

    from .models import User
    jwt_manager.init_app(app)

    @jwt_manager.user_identity_loader
    def identity(user):
        return user.username

    admin.add_view(UserView(User, db.session))

    limiter.init_app(app)
    limiter.logger.addHandler(StreamHandler())

    # logging
    if not debug:
        que = queue.Queue(-1)  # no limit on size
        # Create a QueueHandler to receive logging
        queue_handler = QueueHandler(que)
        queue_handler.setLevel(logging.ERROR)

        # Create the actual mail handler
        credentials = app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD']
        mail_handler = SMTPHandler(
            ('smtp.gmail.com', '587'), app.config['APP_ADDRESS'],
            [app.config['ADMIN_ADDRESS']], 'stock_loan exception',
            credentials=credentials,
            secure=())

        # Create a listener handler to deque things from the QueueHandler and send to the mail handler
        listener = QueueListener(que, mail_handler)
        listener.start()

        # Add the queue handler to the app
        app.logger.addHandler(queue_handler)

        from flask_sslify import SSLify
        SSLify(app)

    @app.before_first_request
    def create_table():
        db.create_all()
        db.reflect()



    @app.before_first_request
    def initialize():
        """Initialize the scheduler for recurring jobs"""


    return app
