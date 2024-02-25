from database.db import db
import os

class Activity(db.Model):
    __tablename__ = "activity"
    
    activity_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(30))  # Revoir si l'on passe le type en int ?
    date = db.Column(db.DateTime)
    activity_location = db.Column(db.Text)

    user = db.relationship('User', secondary='user_participates_activity', back_populates='activity')


    def json(self):
        users = []
        if self.user:
            users = [user.json_rest() for user in self.user]
            
        return {'activity_id': self.activity_id, 'type': self.type, 'date': self.date, 'activity_location' : self.activity_location, 'users': users}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/activity/{self.activity_id}", 'activity_id': self.activity_id, 'type': self.type, 'date': self.date, 'activity_location' : self.activity_location}


user_participates_activity = db.Table('user_participates_activity', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),                                  
    db.Column('activity_id', db.Integer, db.ForeignKey('activity.activity_id'), primary_key=True)
)