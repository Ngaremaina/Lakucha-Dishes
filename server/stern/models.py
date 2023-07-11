from stern import db

class Client(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    firstname = db.Column(db.String)
    lastname = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)


    def __repr__(self):
        return f"{self.id}, {self.firstname}"
    
class Foods(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    price = db.Column(db.Integer)
    description = db.Column(db.String)
    image = db.Column(db.String)

    def __repr__(self):
        return f"{self.id}, {self.image}"