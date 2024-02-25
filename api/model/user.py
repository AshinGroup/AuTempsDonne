from database.db import db

class User(db.Model):
    __tablename__ = "user"
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    email = db.Column(db.String(320), unique=True)
    phone = db.Column(db.String(50))
    password = db.Column(db.String(64))

    role = db.relationship('Role', secondary='user_is_role', back_populates='user')
    activity = db.relationship('Activity', secondary='user_participates_activity', back_populates='user')
    course = db.relationship('Course', secondary='user_follows_course', back_populates='user')

    def json(self):
        roles = [role.json() for role in self.role]
        if self.activity:
            activities = [activity.json() for activity in self.activity]
        else: 
            activities = []
        
        if self.course:
            courses = [course.json() for course in self.course]
        else: 
            courses = []
        return {'id' : self.user_id, 'first_name': self.first_name, 'last_name': self.last_name, 'email': self.email, 'role': roles, 'activity': activities, 'course': courses} 