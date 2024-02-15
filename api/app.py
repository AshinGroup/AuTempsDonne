from flask import Flask
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('HOST_USER')}:{os.getenv('HOST_PASSWORD')}@{os.getenv('HOSTNAME')}/{os.getenv('DB_NAME')}"
