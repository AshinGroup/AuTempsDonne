import mysql.connector
import os
from flask_sqlalchemy import SQLAlchemy



db = SQLAlchemy()

def create_database():
    mydb = mysql.connector.connect(
      host = os.getenv("HOSTNAME"),
      user = os.getenv("HOST_USER"), 
      password = "azerty"
    )

    mycursor = mydb.cursor()

    mycursor.execute(f"CREATE DATABASE IF NOT EXISTS {os.getenv('DB_NAME')}")
    mydb.close()



 




