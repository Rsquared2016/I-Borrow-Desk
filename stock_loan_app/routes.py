import os
import json

from flask import render_template, request, redirect, url_for, flash
from flask.ext.login import login_user, logout_user, current_user, login_required
from apscheduler.schedulers.background import BackgroundScheduler

from stock_loan_app import app, login_manager
from models import User, db
from BorrowDatabase import BorrowDatabase
from email_update import send_emails
from forms import RegistrationForm, ChangePasswordForm, ChangeEmailForm


dirname, filename = os.path.split(os.path.abspath(__file__))
CLIENT_ID = json.loads(open(dirname + '/client_secrets.json', 'r').read())['web']['client_id']

# TEMPLATES
REGISTER_TEMPLATE = 'register_template.html'
CHANGE_PASSWORD_TEMPLATE = 'change_password_template.html'
CHANGE_EMAIL_TEMPLATE = 'change_email_template.html'
LOGIN_TEMPLATE = 'login_template.html'
MAIN_PAGE_TEMPLATE = 'mainpage_template.html'
WATCH_LIST_TEMPLATE = 'watch_list_template.html'
HISTORICAL_REPORT_TEMPLATE = 'historical_report_template.html'

login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(userid):
    return User.query.get(int(userid))


@login_required
@app.route('/change_morning_email')
def change_morning_email():
    """Change morning email preference"""
    new_preference = request.args['receive']
    if new_preference == 'True':
        current_user.receive_email = True
        db.session.add(current_user)
        db.session.commit()
        flash('Now receiving morning emails')
    elif new_preference == 'False':
        current_user.receive_email = False
        db.session.add(current_user)
        db.session.commit()
        flash('No longer receiving morning emails')
    return redirect(url_for('watch_list'))


@login_required
@app.route('/change_password', methods=['GET', 'POST'])
def change_password():
    """Change password handler"""
    form = ChangePasswordForm(request.form)

    if request.method == 'POST' and form.validate():
        if current_user.check_password(form.password.data):
            current_user.set_password(form.new_password.data)
            db.session.add(current_user)
            db.session.commit()
            flash('Password updated')
            return redirect(url_for('watch_list'))
        else:
            flash('Incorrect password entered')
            return redirect(url_for('change_password'))
    return render_template(CHANGE_PASSWORD_TEMPLATE, form=form)

@login_required
@app.route('/change_email', methods=['GET', 'POST'])
def change_email():
    """Change email handler"""
    form = ChangeEmailForm(request.form)
    if request.method == 'POST' and form.validate():
        if current_user.check_password(form.password.data):
            current_user.email = form.new_email.data
            db.session.add(current_user)
            db.session.commit()
            flash('Email changed to %s' %form.new_email.data)
            return redirect(url_for('watch_list'))
        else:
            flash('Incorrect password entered')
            return redirect(url_for('change_email'))
    return render_template(CHANGE_EMAIL_TEMPLATE, form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Registration page handler"""

    form = RegistrationForm(request.form)

    if request.method == 'POST' and form.validate():
        user = User(form.username.data, form.password.data, form.email.data, form.receive_emails.data)
        db.session.add(user)
        db.session.commit()
        flash('User successfully registered')
        return redirect(url_for('login'))
    return render_template(REGISTER_TEMPLATE, form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login page handler"""
    if request.method == 'GET':
        return render_template(LOGIN_TEMPLATE)

    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()

    if user is None:
        flash('Invalid username')
        return redirect(url_for('login'))
    if user.check_password(password) == False:
        flash('Invalid password')
        return redirect(url_for('login'))

    # Flask login
    login_user(user)

    flash('Welcome %s!' %user.username)
    return redirect(url_for('watch_list'))

@app.route('/logout')
def logout():
    """Logs the user out"""
    logout_user()
    flash('Successfully logged out')
    return redirect(url_for('main_page'))


@app.route('/')
def main_page():
    """Mainpage hanlder"""
    return render_template(MAIN_PAGE_TEMPLATE)


@app.route('/watchlist', methods=['GET', 'POST'])
@login_required
def watch_list():
    """Watchlist handler"""

    # If the user added or removed symbols from their watchlist make the changes then re-render thee watchlist
    if request.method == 'POST':
        symbols = request.form['symbols'].replace(' ', '').split(',')
        symbols_to_remove = request.form['remove-symbols'].replace(' ', '').split(',')
        if symbols != ['']:
            stockLoan.insert_watchlist(current_user.id, symbols)
        if symbols_to_remove != ['']:
            stockLoan.remove_watchlist(current_user.id, symbols_to_remove)

    # Get user's watchlist summary
    watchlist = stockLoan.get_watchlist(current_user.id)
    summary = stockLoan.summary_report(watchlist)

    return render_template(WATCH_LIST_TEMPLATE, summary=summary)


@app.route('/historical_report', methods=['GET'])
def historical_report():
    """Historical report handler, uses url arguements to determine the symbol to report
    on and the time period (last few days every 15mins or daily  long-term"""

    # Grab the symbol and real-time flag form the url
    symbol = request.args['symbol'].upper()
    if request.args['real_time'] == 'True':
        real_time = True
    else:
        real_time = False

    summary = []
    name = ''

    # Generate a report based on the url parameters
    if symbol:
        name, summary = stockLoan.historical_report(symbol, real_time)

    return render_template(HISTORICAL_REPORT_TEMPLATE, symbol=symbol, name=name, summary=summary)



@app.before_first_request
def initialize():
    """Initialize the scheduler for recurring jobs"""
    apsched = BackgroundScheduler()
    apsched.start()

    # Add a job - morning emails
    apsched.add_job(email_job, 'cron', day_of_week='mon-fri', hour=9, minute=5, timezone = 'America/New_York')


def email_job():
    """Helper function for scheduled email sender function"""
    users = User.query.filter_by(receive_email = True).all()
    send_emails(users, stockLoan)


# Create a BorrowDatabase instance
stockLoan = BorrowDatabase(database_name='stock_loan', filename='usa', create_new=False)

