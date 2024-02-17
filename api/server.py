from flask import  jsonify
from flask_restful import Api
from dotenv import load_dotenv, find_dotenv
import os

from database.db import db, create_database

from controller.user import UserController, UserListController

from model.user import User

from app import app



# App Config

api = Api(app)

# API Routes
api.add_resource(UserListController, '/user')
api.add_resource(UserController, '/user/<user_id>')


if __name__ == "__main__":
    load_dotenv(find_dotenv())
    create_database()
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(debug=True)