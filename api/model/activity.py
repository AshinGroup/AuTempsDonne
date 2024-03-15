from database.db import db
import os

class Activity(db.Model):
    __tablename__ = "activity"
    
    activity_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    activity_name = db.Column(db.String(30))
    date = db.Column(db.DateTime)
    type_id = db.relationship(db.Integer, db.ForeignKey('post.id'), nullable=False)

    users = db.relationship('User', secondary='user_participates_activity', back_populates='activities')


    def json(self):
        users = []
        if self.users:
            users = [user.json_rest() for user in self.users]
            
        return {'activity_id': self.activity_id, 'type': self.type, 'date': self.date, 'activity_location' : self.activity_location, 'users': users}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/activity/{self.activity_id}", 'activity_id': self.activity_id, 'type': self.type, 'date': self.date, 'activity_location' : self.activity_location}


user_participates_activity = db.Table('user_participates_activity', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),                                  
    db.Column('activity_id', db.Integer, db.ForeignKey('activity.activity_id'), primary_key=True)
)