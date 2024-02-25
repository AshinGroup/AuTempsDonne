from database.db import db

class Course(db.Model):
    __tablename__ = "course"
    
    course_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.Text)

    user = db.relationship('User', secondary='user_follows_course', back_populates='course')

    def json(self):
        return {'course_id': self.course_id, 'title': self.title, 'description': self.description}
    

user_follows_course = db.Table('user_follows_course', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),
    db.Column('course_id', db.Integer, db.ForeignKey('course.course_id'), primary_key=True)
)
    