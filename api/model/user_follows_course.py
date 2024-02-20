from database.db import db

class User_follows_course(db.Model):
    __tablename__ = "user_follows_course"
    
    user_follows_course_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer)
    course_id = db.Column(db.Integer)