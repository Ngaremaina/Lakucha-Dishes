from flask import Blueprint, make_response, jsonify, request
from server.models import Contact
from server.schemas import ContactSchema
from server import db

contact = Blueprint("contact",__name__)

@contact.route("/contact", methods = ["GET"])
def get_contact():
    contact_list = Contact.query.all()
    contact_data = ContactSchema(many = True).dump(contact_list)  
    return make_response(jsonify(contact_data), 200)

@contact.route("/contact/<string:name>", methods = ["GET"])
def get_product(name):
    contact = Contact.query.filter_by(name = name).first()
    contact_data = ContactSchema().dump(contact)
    return make_response(jsonify(contact_data), 200)

@contact.route("/contact/<int:id>", methods = ["DELETE"])
def delete_contact(id):
    contact = Contact.query.filter_by(id = id).first()
    db.session.delete(contact)
    db.session.commit()
    return make_response(jsonify(message = "Message deleted successfully"), 200)
    
@contact.route("/contact", methods = ["POST"])
def add_contact():
    data = request.get_json()
    contact = ContactSchema().load(data)
    new_contact = Contact(**contact)
    db.session.add(new_contact)
    db.session.commit()
    contact_schema = ContactSchema().dump(new_contact)
    return make_response(jsonify(contact_schema))

