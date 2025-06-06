from server import app, render_template, os
from server.routes.user import users
from server.routes.product import products
from server.routes.category import category
from server.routes.rating import ratings
from server.routes.contact import contact
from server.routes.cart import cart
from server.routes.shipping import shippings
from flask import request
import requests
from requests.auth import HTTPBasicAuth

app.register_blueprint(users)
app.register_blueprint(products)
app.register_blueprint(ratings)
app.register_blueprint(category)
app.register_blueprint(cart)
app.register_blueprint(contact)
app.register_blueprint(shippings)

@app.route('/payments', methods=['POST'])
def init_stk():
    amount = request.get_json()["amount"]
    phone = request.get_json()["phone"]

    endpoint = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    access_token = get_access_token()
    headers = { "Authorization": "Bearer %s" % access_token }

    data = {
        "BusinessShortCode": 174379,
        "Password": os.getenv("Password"),
        "Timestamp": "20230929152603",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": 174379,
        "PhoneNumber": phone,
        "CallBackURL": "https://mydomain.com/path",
        "AccountReference": "Lakucha Dishes",
        "TransactionDesc": "Payment of Dishes" 
  }
  

    res = requests.post(endpoint, json = data, headers = headers)
    return res.json()

def get_access_token():
    consumer_key = os.getenv("CONSUMER_KEY")
    consumer_secret = os.getenv("CONSUMER_SECRET")
    endpoint = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

    r = requests.get(endpoint, auth=HTTPBasicAuth(consumer_key, consumer_secret))
    data = r.json()
    return data['access_token']
