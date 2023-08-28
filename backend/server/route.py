from server import app, render_template
from server.routes.user import users

app.register_blueprint(users)


@app.route("/", methods= ["GET"])
def display():
    return render_template("index.html")