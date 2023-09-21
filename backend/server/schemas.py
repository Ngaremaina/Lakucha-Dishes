from marshmallow import Schema, fields

class ClientSchema(Schema):
    id = fields.Integer()
    auth_id = fields.Integer()
    firstname = fields.String()
    lastname = fields.String()
    phone = fields.Integer()
    address = fields.String()
    city = fields.String()
    country = fields.String()

class AdminSchema(Schema):
    id = fields.Integer()
    auth_id = fields.Integer()
    firstname = fields.String()
    lastname = fields.String()
    phone = fields.Integer()

class AuthSchema(Schema):
    id = fields.Integer()
    username = fields.String()
    email = fields.String()
    password = fields.String()
    role = fields.String()
    
    client = fields.Nested(ClientSchema, many=True)
    admin = fields.Nested(AdminSchema, many=True)

class ProductSchema(Schema):
    id = fields.Integer()
    category_id = fields.Integer()
    rating_id = fields.Integer()
    name = fields.String()
    price = fields.Integer()
    image = fields.String()
    quantity = fields.Integer()
    description = fields.String()

class CategorySchema(Schema):
    id = fields.Integer()
    name = fields.String()

    product = fields.Nested(ProductSchema, many=True)

class RatingSchema(Schema):
    id = fields.Integer()
    rate = fields.Integer()

    rating = fields.Nested(ProductSchema, many=True)

class ContactSchema(Schema):
    id = fields.Integer()
    username = fields.String()
    email = fields.String()
    message = fields.String()

class CartSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    price = fields.Integer()
    description = fields.String()
    image = fields.String()
