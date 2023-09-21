from server import app, render_template
from server.routes.user import users
from server.routes.product import products
from server.routes.category import category
from server.routes.rating import ratings
from server.routes.contact import contact
from server.routes.cart import cart

app.register_blueprint(users)
app.register_blueprint(products)
app.register_blueprint(ratings)
app.register_blueprint(category)
app.register_blueprint(cart)
app.register_blueprint(contact)

@app.route("/", methods= ["GET"])
def display():
    return render_template("index.html")