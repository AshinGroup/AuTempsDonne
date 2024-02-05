from flask import Flask, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
# from controller.user import user_blueprint
from model.user import User, create_tables
import os


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('HOST_USER')}:{os.getenv('HOST_PASSWORD')}@{os.getenv('HOSTNAME')}:5000/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)
# app.register_blueprint(user_blueprint, url_prefix = "/api/user")

@app.route('/')
def hello():
    create_tables()
    return 'Hello, World!'


if __name__ == "__main__":
    app.run(debug=True)