from flask import Blueprint, make_response, jsonify
from server.models import Product
from server.schemas import ProductSchema
from server import db

products = Blueprint("products",__name__)

@products.route("/products", methods = ["GET"])
def get_products():
    product_list = Product.query.all()
    profile_data = ProductSchema(many = True).dump(product_list)  
    return make_response(jsonify(profile_data), 200)

@products.route("/products/<int:id>", methods = ["GET"])
def get_user(id):
    product = Product.query.filter_by(id = id).first()
    product_data = ProductSchema(many=True).dump(product)
    return make_response(jsonify(product_data), 200)

@products.route("/products/<int:id>", methods = ["DELETE"])
def delete_user(id):
    product = Product.query.filter_by(id = id).first()
    db.session.delete(product)
    db.session.commit()
    return make_response(jsonify(message = "product deleted successfully"), 200)
    