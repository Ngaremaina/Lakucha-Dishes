from flask import Blueprint, make_response, jsonify

users = Blueprint("users",__name__)

@users.route("/users")
def get_users():
    return make_response(jsonify(), 200)
