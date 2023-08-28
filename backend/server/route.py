from server import app, render_template
from server.routes.user import users
from server.routes.product import products

app.register_blueprint(users)
app.register_blueprint(products)

@app.route("/", methods= ["GET"])
def display():
    return render_template("index.html")