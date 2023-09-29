from flask import Blueprint, make_response, jsonify, request
from server.models import Shipping
from server.schemas import ShippingSchema
from server import db

shippings = Blueprint("shippings",__name__)

@shippings.route("/shippings", methods = ["GET"])
def get_shippings():
    shipping_list = Shipping.query.all()
    shipping_data = ShippingSchema(many = True).dump(shipping_list)  
    return make_response(jsonify(shipping_data), 200)

@shippings.route("/shippings/<string:name>", methods = ["GET"])
def get_shipping(name):
    shipping = Shipping.query.filter_by(name = name).first()
    shipping_data = ShippingSchema().dump(shipping)
    return make_response(jsonify(shipping_data), 200)

@shippings.route("/shippings/<int:id>", methods = ["DELETE"])
def delete_shipping(id):
    shipping = Shipping.query.filter_by(id = id).first()
    db.session.delete(shipping)
    db.session.commit()
    return make_response(jsonify(message = "shipping deleted successfully"), 200)
    
@shippings.route("/shippings", methods = ["POST"])
def add_shipping():
    data = request.get_json()
    shippings = ShippingSchema().load(data)
    new_shipping = Shipping(**shippings)
    db.session.add(new_shipping)
    db.session.commit()
    shipping_schema = ShippingSchema().dump(new_shipping)
    return make_response(jsonify(shipping_schema))

@shippings.route('/users/<int:id>', methods=['PATCH'])
def update_shipping_details(id):
    shipping = Shipping.query.filter_by(id = id).first()
    data = request.get_json()
    shippings = ShippingSchema().load(data)
    for field, value in shippings.items():
        setattr(shipping, field, value)
    db.session.add(shipping)
    db.session.commit() 

    users_data = ShippingSchema().dump(shipping)
    return make_response(jsonify(users_data))