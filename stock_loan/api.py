import io
import csv
import time
from flask import (
    Blueprint,
    current_app,
    jsonify,
    request,
    send_file,
    abort,
)
from flask_jwt_extended import (
    jwt_required,
    jwt_optional,
    get_jwt_identity,
    create_access_token,
)
from itsdangerous import URLSafeTimedSerializer

from .serializers import historical_report_serializer
from .route_helpers import (
    user_loader,
    CSV_TOKEN_SALT)
from .auth.email import (
    send_confirmation,
    send_reset_password_email,
    TOKEN_RESET_SALT,
)
from .extensions import (
    db,
    stock_loan,
    mc,
    limiter,
)
from .models import User, get_user
from .utils import historical_report_cache


api_bp = Blueprint('api_bp', __name__, template_folder='templates')


@api_bp.route('/api/ticker/<symbol>', methods=['GET'])
@jwt_optional
@user_loader
def json_historical_report(symbol, *, user):
    """Handler to deliver historical report in JSON format"""
    return historical_report_serializer(symbol=symbol, user=user)


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
@user_loader
def watchlist(*, user):
    """Watchlist endpoint"""
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
@user_loader
def change_email(*, user):
    """Change email endpoint"""
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
@user_loader
def change_morning_email(*, user):
    """Change email endpoint"""
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
@user_loader
def get_profile(*, user):
    """Get username"""
    return jsonify({
        'username': user.username,
        'id': user.id,
        'receiveEmail': user.receive_email,
        'subscribed': user.subscribed,
    })


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


@limiter.limit("10 per hour")
@api_bp.route('/api/auth', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query \
        .filter((User.username == username) | (User.email == username)) \
        .one_or_none()
    if user and user.check_password(password):
        if user.confirmed_at:
            ret = {'access_token': create_access_token(identity=user)}
            return jsonify(ret), 200
        else:
            return jsonify({'msg': 'Email not yet confirmed - check your email'}), 401
    else:
        return jsonify({'msg': 'Bad username or password'}), 401


@limiter.limit("10 per hour")
@api_bp.route('/api/reset_password', methods=["POST"])
def reset():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()
    if user:
        send_reset_password_email(user)
    else:
        time.sleep(5)

    return jsonify({'msg': 'Password reset token sent.'})


ONE_HOUR = 60 * 60

@limiter.limit("10 per hour")
@api_bp.route('/api/change_password_with_token', methods=["POST"])
def reset_with_token():
    token = request.json.get('token')
    password = request.json.get('password')

    ts = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = ts.loads(token, salt=TOKEN_RESET_SALT, max_age=ONE_HOUR)
    except:
        time.sleep(1)
        return jsonify({'msg': 'Password change complete.'})

    user = User.query.filter_by(email=email).first_or_404()
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'Password change complete.'})


FIVE_MINUTES = 5 * 60

@api_bp.route('/api/ticker/csv/<token>', methods=['GET'])
def csv_historical_report(token):
    ts = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        symbol = ts.loads(token, salt=CSV_TOKEN_SALT, max_age=FIVE_MINUTES)
    except Exception as e:
        print(e)
        time.sleep(1)
        raise abort(404)

    daily = historical_report_cache(symbol=symbol, real_time=False)
    with io.StringIO() as f:
        writer = csv.DictWriter(
            f,
            delimiter=',',
            quotechar='|',
            quoting=csv.QUOTE_MINIMAL,
            fieldnames=['time', 'available', 'fee'],
        )
        writer.writeheader()
        for row in daily:
            print("row", row)
            writer.writerow(row)

    # Creating the byteIO object from the StringIO Object
        mem = io.BytesIO(f.getvalue().encode('utf-8'))
        mem.seek(0)
        return send_file(
            mem,
            attachment_filename=f"{symbol}.csv",
            as_attachment=True,
        )
