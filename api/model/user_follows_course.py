from database.db import db

user_follows_course = db.Table('user_follows_course',
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), primary_key=True),
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), primary_key=True)
)
    
    