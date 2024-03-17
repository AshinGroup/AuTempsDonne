from flask import  jsonify
from flask_restful import Api
from dotenv import load_dotenv, find_dotenv
import os

from database.db import db, create_database

# Import Controllers
from controller.user import UserController, UserListController
from controller.user import UserParticipatesEventController
from controller.user import UserIsRoleController
from controller.user import UserPageController, UserSearchController
from controller.event import EventController, EventListController
from controller.type import TypeController, TypeListController
from controller.role import RoleController, RoleListController
from controller.auth import RegisterController, ProtectedController, LoginController, RefreshTokenController




# Import Models
from model.user import User
from model.event import Event
from model.role import Role
from model.type import Type

from app import app


# API Routes

api = Api(app)
prefix = "/api"
api.add_resource(UserListController, f'{prefix}/user')
api.add_resource(UserPageController, f'{prefix}/user/page/<int:page>')
api.add_resource(UserSearchController, f'{prefix}/user/page/<int:page>/search/<string:search>')
api.add_resource(UserController, f'{prefix}/user/<int:user_id>')
api.add_resource(UserIsRoleController, f'{prefix}/user/<int:user_id>/role/<int:role_id>')
api.add_resource(UserParticipatesEventController, f'{prefix}/user/<int:user_id>/event/<int:event_id>')

api.add_resource(EventListController, f'{prefix}/event')
api.add_resource(EventController, f'{prefix}/event/<int:event_id>')
api.add_resource(TypeListController, f'{prefix}/type')
api.add_resource(TypeController, f'{prefix}/type/<int:type_id>')

api.add_resource(RoleListController, f'{prefix}/role')
api.add_resource(RoleController, f'{prefix}/role/<int:role_id>')
api.add_resource(RegisterController, f'{prefix}/register')
api.add_resource(LoginController, f'{prefix}/login')
api.add_resource(ProtectedController, f'{prefix}/protected')
api.add_resource(RefreshTokenController, f'{prefix}/token/refresh')




if __name__ == "__main__":
    load_dotenv(find_dotenv())
    create_database()
    db.init_app(app)
    with app.app_context():
        # db.drop_all()
        db.create_all()
    app.run(debug=True)