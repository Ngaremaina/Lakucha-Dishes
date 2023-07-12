from stern import app, bcrypt,db
from stern.models import Foods,Client
from flask import jsonify, make_response, request, session


@app.route("/login")
def login_user():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = Client.query.filter_by(email=email).first()
    if user:
        if bcrypt.check_password_hash(user.password, password):
            return jsonify({"message":"Login Successful"})
        return jsonify({"message":"Invalid credentials"})
    return jsonify({"message":"User not found"})
