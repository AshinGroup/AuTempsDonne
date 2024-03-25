from database.db import db
import os

class Location(db.Model):
    __tablename__ = "location"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    address = db.Column(db.String(100))
    zip_code = db.Column(db.String(10))
    city = db.Column(db.String(30))
    country = db.Column(db.String(30))
    # events = db.relationship('Event', backref='location')


    def json(self):
        # events = []
        # if self.events:
        #     events = [event.json_rest() for event in self.events]
            
        return {'id': self.id, 
                'address': self.address, 
                'zip_code': self.zip_code,
                'city': self.city,
                'country': self.country}
                # 'events': events
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/location/{self.id}", 
                'id': self.id, 
                'address': self.address,
                'zip_code': self.zip_code}


