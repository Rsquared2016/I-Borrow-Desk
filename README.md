IB Loan Desk Web App

Purpose: A toy web app to practice databases and web development. Interactive Brokers provides an FTP site with a frequently
    updated csv file of their entire stock loan database with fees, rebates, and availability. The goal of this webapp
    is to provide some analytics for users to track trends in borrow fees and availability of stocks traded in the US.

Added July 8, a simple twitter bot (@IBorrowDesk) that responds to messages including a ticker symbol with a response
summarizing the fee, availability, and last update for the given stock.

Requirements:

Flask
flask-login
flask-sqalchemy
flask-wtf
flask-sslify
flask-admin
psycopg2
apscheduler
twython

  