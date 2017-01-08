__author__ = 'Cameron'
from stock_loan import create_app

app = create_app(debug=True)
app.run(host='0.0.0.0', port=8000, use_reloader=False)