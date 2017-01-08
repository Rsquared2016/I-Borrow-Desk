__author__ = 'Cameron'
from stock_loan import create_app

app = create_app()
app.run(debug=True, host='0.0.0.0', port=8000, use_reloader=False)