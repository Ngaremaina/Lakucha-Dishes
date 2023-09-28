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

@cart.route("/cart/<int:id>", methods = ["GET"])
def get_cart_by_name(id):
    cart_name = Cart.query.filter_by(id = id).first()
    cart_data = CartSchema().dump(cart_name)
    return make_response(jsonify(cart_data), 200)

@cart.route("/cart/<int:id>", methods = ["DELETE"])
def delete_cart(id):
    cart_item = Cart.query.filter_by(id = id).first()
    db.session.delete(cart_item)
    db.session.commit()
    return make_response(jsonify(message = "cart deleted successfully"), 200)
    
@cart.route("/cart", methods = ["POST"])
def add_cart():
    data = request.get_json()
    name = data["name"]
    if Cart.query.filter_by(name = name).first():
        return make_response(jsonify(detail = "Product exists"))
    else:
        cart = CartSchema().load(data)
        new_cart = Cart(**cart)
        db.session.add(new_cart)
        db.session.commit()
        cart_schema = CartSchema().dump(new_cart)
        return make_response(jsonify(cart_schema))

@cart.route('/cart/<int:id>', methods=['PATCH'])
def update_cart_details(id):
    cart = Cart.query.filter_by(id = id).first()
    data = request.get_json()
    carts = CartSchema().load(data)
    for field, value in carts.items():
        setattr(cart, field, value)
    db.session.add(cart)
    db.session.commit() 

    cart_data = CartSchema().dump(cart)
    return make_response(jsonify(cart_data))
