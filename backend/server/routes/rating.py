from flask import Blueprint, make_response, jsonify, request
from server.models import Rating
from server.schemas import RatingSchema
from server import db

ratings = Blueprint("ratings",__name__)

@ratings.route("/ratings", methods = ["GET"])
def get_ratings():
    rating_list = Rating.query.all()
    profile_data = RatingSchema(many = True).dump(rating_list)  
    return make_response(jsonify(profile_data), 200)

@ratings.route("/ratings/<int:id>", methods = ["GET"])
def get_rating(id):
    rating = Rating.query.filter_by(id = id).first()
    rating_data = RatingSchema().dump(rating)
    return make_response(jsonify(rating_data), 200)

@ratings.route("/ratings/<int:id>", methods = ["DELETE"])
def delete_rating(id):
    rating = Rating.query.filter_by(id = id).first()
    db.session.delete(rating)
    db.session.commit()
    return make_response(jsonify(message = "rating deleted successfully"), 200)
    
@ratings.route("/ratings", methods = ["POST"])
def add_rating():
    data = request.get_json()
    ratings = RatingSchema().load(data)
    new_rating = Rating(**ratings)
    db.session.add(new_rating)
    db.session.commit()
    rating_schema = RatingSchema().dump(new_rating)
    return make_response(jsonify(rating_schema))

@ratings.route('/ratings/<int:id>', methods=['PATCH'])
def update_rating_details(id):
    rating = Rating.query.filter_by(id = id).first()
    data = request.get_json()
    ratings = RatingSchema().load(data)
    for field, value in ratings.items():
        setattr(rating, field, value)
    db.session.add(rating)
    db.session.commit() 

    ratings_data = RatingSchema().dump(rating)
    return make_response(jsonify(ratings_data))