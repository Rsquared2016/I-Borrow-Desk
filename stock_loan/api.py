from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

from stock_loan.auth.email import send_confirmation
from .extensions import db, stock_loan, mc
from .models import User, get_user
from .utils import historical_report_cache


api_bp = Blueprint('api_bp', __name__, template_folder='templates')


@api_bp.route('/api/ticker/<symbol>', methods=['GET'])
def json_historical_report(symbol):
    """Handler to deliver historical report in JSON format"""
    real_time = historical_report_cache(symbol=symbol, real_time=True)
    daily = historical_report_cache(symbol=symbol, real_time=False)
    name = stock_loan.get_company_name(symbol)

    return jsonify(real_time=real_time, daily=daily, symbol=symbol, name=name)


@api_bp.route('/api/search/<query>', methods=['GET'])
def json_company_search(query):
    """Handler to return possible Company names"""
    if query.upper() in stock_loan.all_symbols:
        name = stock_loan.get_company_name(query)
        return jsonify(results=[{'symbol': query.upper(), 'name': name}])

    summary = stock_loan.name_search(query)
    results = [{'symbol': row.symbol, 'name': row.name} for row in summary] \
        if summary else []
    return jsonify(results=results)


@api_bp.route('/api/trending', methods=['GET'])
def json_trending():
    """Return trending stocks"""
    trending_fee = mc.get('trending_fee')
    if not trending_fee:
        trending_fee = stock_loan.summary_report(stock_loan.trending_fee)
        mc.set('trending_fee', trending_fee)

    trending_available = mc.get('trending_available')
    if not trending_available:
        trending_available = stock_loan.summary_report(stock_loan.trending_available)
        mc.set('trending_available', trending_available)

    return jsonify(available=trending_available, fee=trending_fee)


@api_bp.route('/api/watchlist', methods=['GET', 'POST', 'DELETE'])
@jwt_required
def watchlist():
    """Watchlist endpoint"""
    user = get_user(get_jwt_identity())
    if request.method == 'POST':
        symbol = request.get_json()['symbol']
        stock_loan.insert_watchlist(user.id, [symbol])

    if request.method == 'DELETE':
        symbol = request.args.get('symbol')
        stock_loan.remove_watchlist(user.id, [symbol.upper()])
        print('delete', symbol)

    watchlist = stock_loan.get_watchlist(user.id)
    return jsonify(watchlist=stock_loan.summary_report(watchlist))


@api_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    errors = {}
    if User.query.filter_by(username=data['username']).first():
        errors['username'] = 'A User with that Username already exists'
    if User.query.filter_by(email=data['email']).first():
        errors['email'] = 'A User with that Email Address already exists'
    if errors:
        return jsonify(errors=errors), 409

    if len(data['username']) < 6:
        errors['username'] = 'Username must be at least 6 characters.'
    if len(data['password']) < 6:
        errors['password'] = 'Password must be at least 6 characters.'
    if errors:
        return jsonify(errors=errors), 406

    if data['password'] != data['confirmPassword']:
        raise ValueError

    user = User(data['username'], data['password'], data['email'], True)
    db.session.add(user)
    db.session.commit()
    send_confirmation(user)

    return jsonify(result='{} created'.format(data['username'])), 201


@api_bp.route('/api/user/email', methods=['POST'])
@jwt_required
def change_email():
    """Change email endpoint"""
    user = get_user(get_jwt_identity())
    data = request.get_json()
    if not user.check_password(data['password']):
        return jsonify(errors= {'password': 'Invalid password'}), 401
    elif User.query.filter_by(email=data['email']).first():
        return jsonify(errors={'email': 'A User with that Email Address already exists'}),\
               409
    user.email = data['email']
    db.session.add(user)
    db.session.commit()
    return jsonify(result='Email successfully changed')


@api_bp.route('/api/user/morning', methods=['POST'])
@jwt_required
def change_morning_email():
    """Change email endpoint"""
    user = get_user(get_jwt_identity())
    user.receive_email = not user.receive_email
    db.session.add(user)
    db.session.commit()
    return jsonify(result='Morning email successfully changed')


@api_bp.route('/api/user/password', methods=['POST'])
@jwt_required
def change_password():
    """Change password endpoint"""
    user = get_user(get_jwt_identity())
    data = request.get_json()
    if not user.check_password(data['password']):
        return jsonify(errors={'password': 'Invalid password'}), 401
    elif data['newPassword'] != data['confirmPassword']:
        return jsonify(errors={'confirmPassword': 'Passwords must match'}), 401

    user.set_password(data['newPassword'])
    db.session.add(user)
    db.session.commit()
    return jsonify(result='Password successfully changed')


@api_bp.route('/api/user', methods=['GET'])
@jwt_required
def get_profile():
    """Get username"""
    user = get_user(get_jwt_identity())
    return jsonify(
        {'username': user.username, 'id': user.id, 'receiveEmail': user.receive_email})


@api_bp.route('/api/filter', methods=['GET'])
def filter():
    try:
        summary = stock_loan.filter_db(**dict(request.args.items()))
    except TypeError:
        return jsonify(error='Invalid filter'), 400
    capped = len(summary) == 100
    return jsonify(results=summary, capped=capped)


@api_bp.route('/api/filter/most_expensive', methods=['GET'])
def most_expensive():
    summary = mc.get('mainpage')
    if not summary:
        summary = stock_loan.filter_db(min_available=10000, min_fee=20, order_by='fee')
        summary = summary[:20]
        mc.set('mainpage', summary)

    return jsonify(results=summary)


@api_bp.route('/api/auth', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).one_or_none()
    if user and user.check_password(password):
        if user.confirmed_at:
            ret = {'access_token': create_access_token(identity=user)}
            return jsonify(ret), 200
        else:
            return jsonify({'msg': 'Email not yet confirmed - check your email'}), 401
    else:
        return jsonify({'msg': 'Bad username or password'}), 401