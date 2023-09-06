from flask import Blueprint, make_response, jsonify, request
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
def get_product(id):
    product = Product.query.filter_by(id = id).first()
    product_data = ProductSchema().dump(product)
    return make_response(jsonify(product_data), 200)

@products.route("/products/<int:id>", methods = ["DELETE"])
def delete_product(id):
    product = Product.query.filter_by(id = id).first()
    db.session.delete(product)
    db.session.commit()
    return make_response(jsonify(message = "product deleted successfully"), 200)
    
@products.route("/products", methods = ["POST"])
def add_product():
    data = request.get_json()
    products = ProductSchema().load(data)
    new_product = Product(**products)
    db.session.add(new_product)
    db.session.commit()
    product_schema = ProductSchema().dump(new_product)
    return make_response(jsonify(product_schema))

@products.route('/products/<int:id>', methods=['PATCH'])
def update_product_details(id):
    image = Product.query.filter_by(id = id).first()
    data = request.get_json()
    products = ProductSchema().load(data)
    for field, value in products.items():
        setattr(image, field, value)
    db.session.add(image)
    db.session.commit() 

    products_data = ProductSchema().dump(image)
    return make_response(jsonify(products_data))