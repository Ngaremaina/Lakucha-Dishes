from flask import Flask, render_template
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")

db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)
ma.init_app(app)

jwt = JWTManager(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "https://lakucha-dishes.vercel.app"])