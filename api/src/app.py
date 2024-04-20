from datetime import timedelta
from flask import Flask
from flask_cors import CORS
import os

from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('HOST_USER')}:{os.getenv('HOST_PASSWORD')}@{os.getenv('HOSTNAME')}:3306/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
app.config["JWT_COOKIE_SECURE"] = False
# app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.json.sort_keys = False

CORS(app)