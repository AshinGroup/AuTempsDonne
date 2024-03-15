from database.db import db
import os

class Type(db.Model):
    __tablename__ = "type"
    
    type_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_name = db.Column(db.String(50))

    activities = db.relationship('Activity', back_ref='type')


    def json(self):
        activites = []
        if self.activities:
            activites = [activity.json_rest() for activity in self.activities]
            
        return {'type_id': self.type_id, 'type_name': self.type_name, 'activities': activities}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/activity/type/{self.type_id}", 'type_id': self.type_id, 'type_name': self.type_name}


