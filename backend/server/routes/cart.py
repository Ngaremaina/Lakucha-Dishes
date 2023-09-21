from flask import Blueprint, make_response, jsonify, request
from server.models import Cart
from server.schemas import CartSchema
from server import db

cart = Blueprint("cart",__name__)

@cart.route("/cart", methods = ["GET"])
def get_cart():
    cart_list = Cart.query.all()
    profile_data = CartSchema(many = True).dump(cart_list)  
    return make_response(jsonify(profile_data), 200)

@cart.route("/cart/<string:name>", methods = ["GET"])
def get_product(name):
    product = Cart.query.filter_by(name = name).first()
    product_data = CartSchema().dump(product)
    return make_response(jsonify(product_data), 200)

@cart.route("/cart/<int:id>", methods = ["DELETE"])
def delete_cart(id):
    cart = Cart.query.filter_by(id = id).first()
    db.session.delete(cart)
    db.session.commit()
    return make_response(jsonify(message = "cart deleted successfully"), 200)
    
@cart.route("/cart", methods = ["POST"])
def add_cart():
    data = request.get_json()
    cart = CartSchema().load(data)
    new_cart = Cart(**cart)
    db.session.add(new_cart)
    db.session.commit()
    cart_schema = CartSchema().dump(new_cart)
    return make_response(jsonify(cart_schema))

@cart.route('/cart/<int:id>', methods=['PATCH'])
def update_cart_details(id):
    cart = cart.query.filter_by(id = id).first()
    data = request.get_json()
    cart = CartSchema().load(data)
    for field, value in cart.items():
        setattr(cart, field, value)
    db.session.add(cart)
    db.session.commit() 

    cart_data = CartSchema().dump(cart)
    return make_response(jsonify(cart_data))
