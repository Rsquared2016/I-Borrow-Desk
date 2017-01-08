from functools import wraps
from flask_login import current_user

from .extensions import stock_loan, db, mc
from .models import User
from .email_update import send_emails


def historical_report_cache(*, symbol, real_time):
    """Return the historical report for a given
    symbol and real_time flag. Takes care of memcache"""
    key_summary = str(symbol + str(real_time))
    summary = mc.get(key_summary)

    if not summary:
        summary = stock_loan.historical_report(symbol, real_time)
        if summary:
            mc.set(key_summary, summary)

    return summary


def view_logger(func):
    """View decorator to track page views by logged in users"""
    @wraps(func)
    def decorated_view(*args, **kwargs):
        # Only track logged in users
        if not current_user.is_anonymous:
            current_user.increment_views()
            db.session.commit()
        return func(*args, **kwargs)

    return decorated_view


def email_job():
    """Helper function for scheduled email sender function"""
    users = User.query.filter_by(receive_email=True).all()
    send_emails(users, stock_loan)


def refresh_borrow():
    """Helper function for refreshing instance summary data for the Borrow object
    Does NOT perform any actual database updates"""
    stock_loan.update_trending()
    stock_loan.refresh_all_symbols()
    stock_loan.refresh_latest_all_symbols()
    print("Refreshed Local Borrow data")