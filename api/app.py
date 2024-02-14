from flask import Flask, jsonify
from flask_restful import Api
import os

from database.db import db, create_database

from controller.user import UserController, UserListController

from model.user import User

# App Config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('HOST_USER')}:{os.getenv('HOST_PASSWORD')}@{os.getenv('HOSTNAME')}:3306/{os.getenv('DB_NAME')}"

api = Api(app)

# API Routes
api.add_resource(UserListController, '/user')
api.add_resource(UserController, '/user/<user_id>')

# API Errors
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == "__main__":
    create_database()
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run(debug=True)