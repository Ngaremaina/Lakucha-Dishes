from server import app, render_template
import server.routes.user

@app.route("/", methods= ["GET"])
def display():
    return render_template("index.html")