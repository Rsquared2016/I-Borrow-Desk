from stock_loan.models import User
from stock_loan.extensions import db
from stock_loan.factory import create_app


def create_admin(username, password, email, receive_email):
    """Function to create an admin user"""
    admin = User(username, password, email, bool(receive_email), True)
    db.session.add(admin)
    db.session.commit()
    print('Admin with username {} successfully created.'.format(username))


app = create_app()
username = input("Admin username: ")
password = input("Admin password: ")
email = input("Admin email: ")
receive_email = input("Receive Email? True/False: ")

create_admin(username, password, email, receive_email)