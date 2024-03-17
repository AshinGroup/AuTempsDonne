from database.db import db
import os
from datetime import datetime

class Activity(db.Model):
    __tablename__ = "activity"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(30))
    datetime = db.Column(db.DateTime)
    description = db.Column(db.Text)
    capacity = db.Column(db.Integer)
    group = db.Column(db.Integer) # 0 = Activity / 1 = Course / 2 = Service

    type_id = db.Column(db.Integer, db.ForeignKey('type.id'), nullable=False)
    users = db.relationship('User', secondary='user_participates_activity', back_populates='activities')


    def json(self):
        users = []
        if self.users:
            users = [user.json_rest() for user in self.users]
            
        return {'id': self.id, 
                'name' : self.name,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),  
                'description': self.description,
                'capacity': self.capacity,
                'type': {
                    'url':f"{os.getenv('API_PATH')}/event/{self.type_id}",
                    'name': self.type.name
                },
                'users': users}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/activity/{self.id}", 
                'id': self.id,
                'name' : self.name,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'description': self.description,
                'capacity': self.capacity,
                'type': {
                    'url':f"{os.getenv('API_PATH')}/activity/{self.type_id}",
                    'name': self.type.name
                }}


user_participates_activity = db.Table('user_participates_activity', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),                                  
    db.Column('activity_id', db.Integer, db.ForeignKey('activity.id'), primary_key=True)
)