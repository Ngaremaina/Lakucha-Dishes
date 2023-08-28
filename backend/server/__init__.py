from flask import Flask, render_template
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__,
            static_url_path='',
            static_folder='../../client/build',
            template_folder='../../client/build')

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = "b'j~S\xcf\x11\x85\x04\x00D\xf0\x91\xc13\xb1\xc0\x04'"

db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)
ma.init_app(app)
