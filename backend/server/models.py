from server import db

class Auth(db.Model):
    __tablename__ = "auth"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255))
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    role = db.Column(db.String(255))

class Client(db.Model):
    __tablename__ = "client"
    id = db.Column(db.Integer, primary_key=True)
    auth_id = db.Column(db.Integer, db.ForeignKey("auth.id"))
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    phone = db.Column(db.Integer)
    address = db.Column(db.String(255))
    city = db.Column(db.String(255))
    country = db.Column(db.String(255))
    image = db.Column(db.String(255))

    auth = db.relationship("Auth", backref = "client")
    # orders = db.relationship("Orders", backref = "client")
class Admin(db.Model):
    __tablename__ = "admin"
    id = db.Column(db.Integer, primary_key = True)
    auth_id = db.Column(db.Integer, db.ForeignKey("auth.id"))
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    phone = db.Column(db.Integer)
    
    auth = db.relationship("Auth", backref = "admin")


class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    price = db.Column(db.Integer)
    image = db.Column(db.String(255))
    quantity = db.Column(db.Integer)

    category = db.relationship("Category", backref = "product")

class Category(db.Model):
    __tablename__ = "category"
    id = db.Column(db.Integer, primary_key = True)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    name = db.Column(db.String(255))

# class Orders(db.Model):
#     __tablename__ = "orders"

#     id = db.Column(db.Integer, primary_key = True)
#     client_id = db.Column(db.ForeignKey("client.id"))
#     shipping_date = db.Column(db.Date)
