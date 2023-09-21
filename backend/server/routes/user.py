from flask import Blueprint, make_response, jsonify, request
from server.models import Auth
from server.schemas import AuthSchema
from server import db

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
    

@users.route("/users", methods = ["POST"])
def add_users():
    data = request.get_json()
    users = AuthSchema().load(data)
    new_users = Auth(**users)
    db.session.add(new_users)
    db.session.commit()
    users_schema = AuthSchema().dump(new_users)
    return make_response(jsonify(users_schema),201)

@users.route('/users/<int:id>', methods=['PATCH'])
def update_users_details(id):
    users = Auth.query.filter_by(id = id).first()
    data = request.get_json()
    users = AuthSchema().load(data)
    for field, value in users.items():
        setattr(users, field, value)
    db.session.add(users)
    db.session.commit() 

    users_data = AuthSchema().dump(users)
    return make_response(jsonify(users_data),200)
