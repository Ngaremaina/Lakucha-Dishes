from flask import Blueprint, make_response, jsonify
from server.models import Client
from server.schemas import ClientSchema
from server import db

users = Blueprint("users",__name__)

@users.route("/users", methods = ["GET"])
def get_users():
    client_list = Client.query.all()
    profile_data = ClientSchema(many = True).dump(client_list)  
    return make_response(jsonify(profile_data), 200)

@users.route("/users/<int:id>", methods = ["GET"])
def get_user(id):
    client = Client.query.filter_by(id = id).first()
    client_data = ClientSchema(many=True).dump(client)
    return make_response(jsonify(client_data), 200)

@users.route("/users/<int:id>", methods = ["DELETE"])
def delete_user(id):
    client = Client.query.filter_by(id = id).first()
    db.session.delete(client)
    db.session.commit()
    return make_response(jsonify(message = "user deleted successfully"), 200)
    