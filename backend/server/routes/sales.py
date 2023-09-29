from flask import Blueprint, make_response, jsonify, request
from server.models import Sales
from server.schemas import SaleSchema
from server import db

sales = Blueprint("sales",__name__)

@sales.route("/sales", methods = ["GET"])
def get_sales():
    sales_list = Sales.query.all()
    sales_data = SaleSchema(many = True).dump(sales_list)  
    return make_response(jsonify(sales_data), 200)

@sales.route("/sales/<int:id>", methods = ["GET"])
def get_each_sales(id):
    sales = Sales.query.filter_by(id = id).first()
    sales_data = SaleSchema().dump(sales)
    return make_response(jsonify(sales_data), 200)

@sales.route("/sales/<int:id>", methods = ["DELETE"])
def delete_sales(id):
    sales = Sales.query.filter_by(id = id).first()
    db.session.delete(sales)
    db.session.commit()
    return make_response(jsonify(message = "sales deleted successfully"), 200)
    
@sales.route("/sales", methods = ["POST"])
def add_sales():
    data = request.get_json()
    name = data["name"]
    if Sales.query.filter_by(name = name).first():
        return make_response(jsonify(detail = "Sale exists"))
    else:
        sales = SaleSchema().load(data)
        new_sale = Sales(**sales)
        db.session.add(new_sale)
        db.session.commit()
        cart_schema = SaleSchema().dump(new_sale)
        return make_response(jsonify(cart_schema))

@sales.route('/users/<int:id>', methods=['PATCH'])
def update_sales_details(id):
    sales = Sales.query.filter_by(id = id).first()
    data = request.get_json()
    sales = SaleSchema().load(data)
    for field, value in sales.items():
        setattr(sales, field, value)
    db.session.add(sales)
    db.session.commit() 

    users_data = SaleSchema().dump(sales)
    return make_response(jsonify(users_data))