from database.db import db
import os

class User(db.Model):
    __tablename__ = "user"
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    email = db.Column(db.String(320), unique=True)
    phone = db.Column(db.String(50))
    password = db.Column(db.String(64))
    status = db.Column(db.Integer) # 0 = waiting, 1 = valided

    role = db.relationship('Role', secondary='user_is_role', back_populates='user')
    activity = db.relationship('Activity', secondary='user_participates_activity', back_populates='user')
    course = db.relationship('Course', secondary='user_follows_course', back_populates='user')

    def json(self):
        roles = [role.json_rest() for role in self.role]

        activities = []
        if self.activity:
            activities = [activity.json_rest() for activity in self.activity]
        
        courses = []
        if self.course:
            courses = [course.json_rest() for course in self.course]
         
            
        return {'id' : self.user_id, 'first_name': self.first_name, 'last_name': self.last_name, 'email': self.email, 'status': self.status, 'phone':self.phone, 'role': roles, 'activity': activities, 'course': courses} 
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/user/{self.user_id}", 'id' : self.user_id, 'first_name': self.first_name, 'last_name': self.last_name, 'email': self.email} 