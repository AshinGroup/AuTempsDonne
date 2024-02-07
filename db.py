import mysql.connector
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from api.model.base import Base
from api.model.user import User
from api.model.course import Course, follow_table

load_dotenv() # Put only on the app.py later

def create_database():
    mydb = mysql.connector.connect(
      host = os.getenv("HOSTNAME"),
      user = os.getenv("HOST_USER"),
      password = os.getenv("HOST_PASSWORD")
    )

    mycursor = mydb.cursor()

    mycursor.execute(f"CREATE DATABASE {os.getenv('DB_NAME')}")

def create_tables():
    engine = create_engine(f"mysql+mysqlconnector://{os.getenv('HOST_USER')}:{os.getenv('HOST_PASSWORD')}@{os.getenv('HOSTNAME')}:3306/{os.getenv('DB_NAME')}", echo=True)
    conn = engine.connect()
    print(conn)

    Base.metadata.create_all(engine)




if __name__ == "__main__":
    # create_database()
    create_tables()