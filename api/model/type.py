from database.db import db
import os

class Type(db.Model):
    __tablename__ = "type"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))

    activities = db.relationship('Activity', backref='type')


    def json(self):
        activities = []
        if self.activities:
            activities = [activity.json_rest() for activity in self.activities]
            
        return {'id': self.id, 
                'name': self.name, 
                'activities': activities}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/activity/type/{self.id}", 
                'id': self.id, 
                'name': self.name}


