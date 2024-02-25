from flask import  jsonify
from flask_restful import Api
from dotenv import load_dotenv, find_dotenv
import os

from database.db import db, create_database

# Import Controllers
from controller.user import UserController, UserListController
from controller.activity import ActivityController, ActivityListController
from controller.course import CourseController, CourseListController
from controller.role import RoleController, RoleListController

# Import Models
from model.user import User
from model.activity import Activity
from model.course import Course
from model.role import Role

from app import app


# API Routes
api = Api(app)
api.add_resource(UserListController, '/user')
api.add_resource(UserController, '/user/<int:user_id>')
api.add_resource(ActivityListController, '/activity')
api.add_resource(ActivityController, '/activity/<int:activity_id>')
api.add_resource(CourseListController, '/course')
api.add_resource(CourseController, '/course/<int:course_id>')
api.add_resource(RoleListController, '/role')
api.add_resource(RoleController, '/role/<int:role_id>')



if __name__ == "__main__":
    load_dotenv(find_dotenv())
    create_database()
    db.init_app(app)
    with app.app_context():
        # db.drop_all()
        db.create_all()
    app.run(debug=True)