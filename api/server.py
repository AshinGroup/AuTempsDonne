from flask import  jsonify
from flask_restful import Api
from dotenv import load_dotenv, find_dotenv
import os

from database.db import db, create_database

# Import Controllers
from controller.user import UserController, UserListController

# Import Models
from model.user import User
from model.activity import Activity
from model.course import Course
from model.user_follows_course import user_follows_course
from model.user_participates_activity import user_participates_activity

from app import app


# API Routes
api = Api(app)
api.add_resource(UserListController, '/user')
api.add_resource(UserController, '/user/<int:user_id>')



if __name__ == "__main__":
    load_dotenv(find_dotenv())
    create_database()
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(debug=True)