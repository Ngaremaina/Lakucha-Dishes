from flask import Flask, render_template
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__,
            static_url_path='',
            static_folder='../../client/build',
            template_folder='../../client/build')

db = SQLAlchemy(app)
ma = Marshmallow()

ma.init_app(app)
