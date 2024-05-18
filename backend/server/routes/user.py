from flask import Blueprint, make_response, jsonify, request
from server.models import Auth
from server.schemas import AuthSchema
from server import db
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

users = Blueprint("users",__name__)

@users.route("/users", methods = ["GET"])
def get_users():
    client_list = Auth.query.all()
    profile_data = AuthSchema(many = True).dump(client_list)  
    return make_response(jsonify(profile_data), 200)

@users.route("/users/<int:id>", methods = ["GET"])
def get_user(id):
    client = Auth.query.filter_by(id = id).first()
    client_data = AuthSchema().dump(client)
    return make_response(jsonify(client_data), 200)

@users.route("/users/<int:id>", methods = ["DELETE"])
def delete_user(id):
    client = Auth.query.filter_by(id = id).first()
    db.session.delete(client)
    db.session.commit()
    return make_response(jsonify(message = "user deleted successfully"), 200)
    
@users.route('/users/<int:id>', methods=['PATCH'])
def update_user_details(id):
    user = Auth.query.filter_by(id = id).first()
    data = request.get_json()
    users = AuthSchema().load(data)
    for field, value in users.items():
        setattr(user, field, value)
    db.session.add(user)
    db.session.commit() 

    users_data = AuthSchema().dump(user)
    return make_response(jsonify(users_data))

@users.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    user = Auth.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Wrong Email or Password'}), 401
    
    access_token = create_access_token(identity=email)  
    return make_response(jsonify({
        "access_token":access_token,
        "email":user.email,
        "username":user.username,
        "id":user.id
    }), 200)

@users.route('/register', methods=['POST'])
def signup():
    data=request.get_json()
    username = data["username"]
    email = data["email"]
    password = data["password"]
    role = data["role"]    
    
    password_hash = generate_password_hash(password)

    if Auth.query.filter_by(email=email).first():
        return jsonify(detail = 'User exists')
    
    else:
        nuser=Auth(
            email=email,
            password=password_hash,
            username=username, 
            role = role
        )    
        db.session.add(nuser)
        db.session.commit()
    
        user_data = AuthSchema().dump(nuser)
        return make_response(jsonify(user_data),200)