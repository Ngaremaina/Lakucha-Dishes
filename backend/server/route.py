from server import app, render_template
from server.routes.user import users
from server.routes.product import products
from server.routes.category import category
from server.routes.rating import ratings

app.register_blueprint(users)
app.register_blueprint(products)
app.register_blueprint(ratings)
app.register_blueprint(category)

@app.route("/", methods= ["GET"])
def display():
    return render_template("index.html")