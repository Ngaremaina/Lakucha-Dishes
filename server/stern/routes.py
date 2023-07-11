from stern import app, bcrypt,db
from stern.models import Foods,Client
from flask import jsonify, make_response, request, session


@app.route("/login")
def login_user(email):
    email = request.json['email']
    password = request.json['password']
    user = Client.query.filter_by(email=email).first()
    if user:
        if bcrypt.check_password_hash(user.password, password):
            return jsonify({'message': 'Login Successful'})
        else:
            return jsonify({'message': 'Invalid Credentials'})
    else:
        return jsonify({'message': 'User not found'})


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    password = data['password']
    hashed_password = bcrypt.generate_password_hash(password)
    
    new_user = Client(
        firstname = data["firstname"],
        lastname = data["lastname"],
        email = data["email"],
        password = hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registration Successful'})
    
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('email', None)
    return {"msg": "User logged out"}

@app.route("/")
def get_foods():
    foods = Foods.query.all()
    food_list = []
    for food in foods:
        food_data = {
            "id":food.id, 
            "name":food.name,
            "price":food.price,
            "description":food.description,
            "image":food.image
        }
        food_list.append(food_data)
    return make_response(jsonify(food_list), 200)