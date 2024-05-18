from server import db

class Auth(db.Model):
    __tablename__ = "auth"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255))
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    role = db.Column(db.String(255))


class Profile(db.Model):
    __tablename__ = "profile"
    id = db.Column(db.Integer, primary_key = True)
    auth_id = db.Column(db.Integer, db.ForeignKey("auth.id"))
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    phone = db.Column(db.Integer)
    image = db.Column(db.String(255))

    auth = db.relationship("Auth", backref = "profile")

class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))

class Rating(db.Model):
    __tablename__ = "rating"

    id = db.Column(db.Integer, primary_key = True)
    rate = db.Column(db.Float)

class Product(db.Model):
    __tablename__ = "product"

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"))
    rating_id = db.Column(db.Integer, db.ForeignKey("rating.id"))
    name = db.Column(db.String(255))
    price = db.Column(db.Integer)
    image = db.Column(db.String(255))
    quantity = db.Column(db.Integer)
    description = db.Column(db.String(255))

    category = db.relationship("Category", backref = "product")
    rating = db.relationship("Rating", backref = "product")



class Contact(db.Model):
    __tablename__ = "contact"

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(255))
    email = db.Column(db.String(255))
    message = db.Column(db.String(255))

class Cart(db.Model):
    __tablename__ = "cart"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))
    price = db.Column(db.Integer)
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))
    quantity = db.Column(db.Integer)
    total = db.Column(db.Integer)
    auth_id = db.Column(db.Integer, db.ForeignKey("auth.id"))

    auth = db.relationship("Auth", backref = "cart")


class Shipping(db.Model):
    __tablename__ = "shipping"

    id = db.Column(db.Integer, primary_key = True)
    auth_id = db.Column(db.Integer, db.ForeignKey("auth.id"))
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    region = db.Column(db.String(255))
    address = db.Column(db.String(255))
    city = db.Column(db.String(255))

    shipping = db.relationship("Auth", backref = "shipping")