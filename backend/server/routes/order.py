# from flask import Blueprint, make_response, jsonify, request
# # from server.models import Order
# from server.schemas import OrderSchema
# from server import db

# orders = Blueprint("orders",__name__)

# @orders.route("/orders", methods = ["GET"])
# def get_orders():
#     order_list = Order.query.all()
#     profile_data = OrderSchema(many = True).dump(order_list)  
#     return make_response(jsonify(profile_data), 200)

# @orders.route("/orders/<string:name>", methods = ["GET"])
# def get_order(name):
#     order = Order.query.filter_by(name = name).first()
#     order_data = OrderSchema().dump(order)
#     return make_response(jsonify(order_data), 200)

# @orders.route("/orders/<int:id>", methods = ["DELETE"])
# def delete_order(id):
#     order = Order.query.filter_by(id = id).first()
#     db.session.delete(order)
#     db.session.commit()
#     return make_response(jsonify(message = "order deleted successfully"), 200)
    
# @orders.route("/orders", methods = ["POST"])
# def add_order():
#     data = request.get_json()
#     orders = OrderSchema().load(data)
#     new_order = Order(**orders)
#     db.session.add(new_order)
#     db.session.commit()
#     order_schema = OrderSchema().dump(new_order)
#     return make_response(jsonify(order_schema))

# @orders.route('/users/<int:id>', methods=['PATCH'])
# def update_order_details(id):
#     order = Order.query.filter_by(id = id).first()
#     data = request.get_json()
#     orders = OrderSchema().load(data)
#     for field, value in orders.items():
#         setattr(order, field, value)
#     db.session.add(order)
#     db.session.commit() 

#     users_data = OrderSchema().dump(order)
#     return make_response(jsonify(users_data))