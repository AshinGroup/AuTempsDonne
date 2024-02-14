from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from controller.user import UserController, UserListController
import os


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('HOST_USER')}:{os.getenv('HOST_PASSWORD')}@{os.getenv('HOSTNAME')}:5000/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
api = Api(app)


api.add_resource(UserListController, '/user')
api.add_resource(UserController, '/user/<user_id>')

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == "__main__":
    app.run(debug=True)