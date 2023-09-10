from flask import Blueprint, make_response, jsonify, request
from server.models import Category
from server.schemas import CategorySchema
from server import db

category = Blueprint("category",__name__)

@category.route("/category", methods = ["GET"])
def get_category():
    category_list = Category.query.all()
    profile_data = CategorySchema(many = True).dump(category_list)  
    return make_response(jsonify(profile_data), 200)

@category.route("/category/<int:id>", methods = ["DELETE"])
def delete_category(id):
    category = Category.query.filter_by(id = id).first()
    db.session.delete(category)
    db.session.commit()
    return make_response(jsonify(message = "category deleted successfully"), 200)
    
@category.route("/category", methods = ["POST"])
def add_category():
    data = request.get_json()
    category = CategorySchema().load(data)
    new_category = Category(**category)
    db.session.add(new_category)
    db.session.commit()
    category_schema = CategorySchema().dump(new_category)
    return make_response(jsonify(category_schema))

@category.route('/category/<int:id>', methods=['PATCH'])
def update_category_details(id):
    category = Category.query.filter_by(id = id).first()
    data = request.get_json()
    category = CategorySchema().load(data)
    for field, value in category.items():
        setattr(category, field, value)
    db.session.add(category)
    db.session.commit() 

    category_data = CategorySchema().dump(category)
    return make_response(jsonify(category_data))
