from database.db import db
import os

class Type(db.Model):
    __tablename__ = "type"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))

    events = db.relationship('Event', backref='type')


    def json(self):
        events = [event.json_rest() for event in self.events] if self.events else []
            
        return {'id': self.id, 
                'name': self.name, 
                'events': events}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/type/{self.id}", 
                'id': self.id, 
                'name': self.name}


