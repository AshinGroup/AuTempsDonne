import mysql.connector
import os
from dotenv import load_dotenv, find_dotenv
from flask_sqlalchemy import SQLAlchemy

load_dotenv(find_dotenv())

db = SQLAlchemy()

def create_database():
    mydb = mysql.connector.connect(
      host = os.getenv("HOSTNAME"),
      user = os.getenv("HOST_USER"), 
      password = os.getenv("HOST_PASSWORD")
    )

    mycursor = mydb.cursor()

    mycursor.execute(f"CREATE DATABASE IF NOT EXISTS {os.getenv('DB_NAME')}")
    mydb.close()



 




