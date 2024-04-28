from database.db import db
import os

class Delivery(db.Model):
    __tablename__ = "delivery"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    datetime = db.Column(db.DateTime)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    locations = db.relationship(
        'Location', secondary='delivers_to_location', back_populates='deliveries')


    def json(self):
        locations = [location.json_rest() for location in self.locations] if self.locations else []
        return {'id': self.id,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'user' : self.user.json_rest(),
                'locations': locations}


    def json_rest_user(self):
        locations = [location.json_rest() for location in self.locations] if self.locations else []
        return {'url': f"{os.getenv('API_PATH')}/delivery/{self.id}",
                'id': self.id,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'locations': locations}
    

    def json_rest_location(self):
        return {'url': f"{os.getenv('API_PATH')}/delivery/{self.id}",
                'id': self.id,
                'name': self.name,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'user' : self.user.json_rest()}


delivers_to_location = db.Table('delivers_to_location', db.metadata,
                        db.Column('location_id', db.Integer, db.ForeignKey(
                            'location.id'), primary_key=True),
                        db.Column('delivery_id', db.Integer, db.ForeignKey(
                            'delivery.id'), primary_key=True)
                        )
