from database.db import db

class Course(db.Model):
    __tablename__ = "course"
    
    course_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.Text)
