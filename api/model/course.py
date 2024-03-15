from database.db import db
import os

class Course(db.Model):
    __tablename__ = "course"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(30), unique=True)
    description = db.Column(db.Text)

    users = db.relationship('User', secondary='user_follows_course', back_populates='courses')

    def json(self):
        users = []
        if self.users:
            users = [user.json_rest() for user in self.users]

        return {'id': self.id, 
                'title': self.title, 
                'description': self.description, 
                'users' : users}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/course/{self.id}", 
                'id': self.id, 
                'title': self.title, 
                'description': self.description}
    

user_follows_course = db.Table('user_follows_course', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'), primary_key=True)
)
    