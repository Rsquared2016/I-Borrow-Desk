from flask import current_app, render_template, url_for
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer

from ..extensions import mailer

def send_confirmation(user):
    ts = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = ts.dumps(user.email, salt='email-confirm-key')
    confirmation_url = url_for('templated_bp.confirm_email', token=token, _external=True)

    msg = Message()
    msg.add_recipient(user.email)
    msg.subject = 'IBorrowDesk Email Confirmation'
    msg.html = render_template(
        'email/confirmation_email.html',
        user=user,
        confirmation_url=confirmation_url
    )
    with mailer.record_messages() as outbox:
        mailer.send(msg)
        print(outbox[0])
