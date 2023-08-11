from flask import Flask, render_template

app = Flask(__name__,
            static_url_path='',
            static_folder='../client/build',
            template_folder='../client/build/')

@app.route("/", methods= ["GET"])
def display():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)