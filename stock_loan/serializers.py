from flask import jsonify

from .route_helpers import csv_download_link
from .extensions import (
    stock_loan,
)
from .utils import historical_report_cache


def historical_report_serializer(*, symbol, user):
    results = {
        'real_time': historical_report_cache(symbol=symbol, real_time=True),
        'daily': historical_report_cache(symbol=symbol, real_time=False),
        'name': stock_loan.get_company_name(symbol),
    }
    if user and user.subscribed:
        results['csv'] = csv_download_link(symbol)
    return jsonify(**results)
