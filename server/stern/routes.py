from stern import app, bcrypt,db
from stern.models import Foods,Client
from flask import jsonify, make_response, request, session


@app.route("/login", methods = ["POST"])
def login_user(): 
    email = request.json["email"]
    password = request.json["password"]
    user = Client.query.filter_by(email=email).first()
    if user:
        if bcrypt.check_password_hash(user.password, password):
            return jsonify({"message":"Login Successful"})
        return jsonify({"message":"Invalid credentials"})
    return make_response(jsonify({"message":"User not found"}),200)

@app.route("/signup", methods = ["POST"])
def register_user():
    data = request.get_json()
    password = data["password"]
    hashed_password = bcrypt.generate_password_hash(password)

    new_user = Client(
        firstname = data["firstname"],
        lastname = data["lastname"],
        email = data["email"],
        password = hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return make_response(jsonify({"message":"Registration Successful"}),200)

@app.route("logout", methods = ["POST"])
def logout_user():
    session.pop("email", None)
    return make_response(jsonify({"message":"Logout Successful"}),200)


@app.route("/")
def get_foods():
    foods = Foods.query.all()
    food_list = []
    for food in foods:
        food_item = {
            "name":food.name,
            "price":food.price,
            "description":food.description,
            "image":food.image
        }
        food_list.append(food_item)
    return make_response(jsonify(food_list))
        
