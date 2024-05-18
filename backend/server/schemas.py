from marshmallow import Schema, fields

class ProfileSchema(Schema):
    id = fields.Integer(dump_only=True)
    auth_id = fields.Integer(required=True)
    firstname = fields.String(required=True)
    lastname = fields.String(required=True)
    phone = fields.Integer()
    image = fields.String()

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
    auth_id = fields.Integer()
    quantity = fields.Integer()
    total = fields.Integer()

class ShippingSchema(Schema):
    id = fields.Integer()
    client_id = fields.Integer()
    firstname = fields.String()
    lastname = fields.String()
    region = fields.String()
    address = fields.String()
    city = fields.String()


class AuthSchema(Schema):
    id = fields.Integer()
    username = fields.String()
    email = fields.String()
    password = fields.String()
    role = fields.String()
    
    cart = fields.Nested(CartSchema, many= True)
    profile = fields.Nested(ProfileSchema, many=True)