from database.db import db
import os

class Delivery(db.Model):
    __tablename__ = "delivery"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    datetime = db.Column(db.DateTime)
    roadmap = db.String(200)
    status = db.Integer(db.Integer)

    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)

    users = db.relationship(
        'User', secondary='users_delivers', back_populates='deliveries')

    locations = db.relationship(
        'Location', secondary='delivers_to_location', back_populates='deliveries')


    def json(self):
        users = [user.json_rest() for user in self.users] if self.users else []
        locations = [location.json_rest() for location in self.locations] if self.locations else []
        return {'id': self.id,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'user' : users,
                'vehicle': self.vehicle.json_rest(),
                'locations': locations}


    def json_rest_user(self):
        locations = [location.json_rest() for location in self.locations] if self.locations else []
        return {'url': f"{os.getenv('API_PATH')}/delivery/{self.id}",
                'id': self.id,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'vehicle': self.vehicle.json_rest(),
                'locations': locations}
    

    def json_rest_location(self):
        users = [user.json_rest() for user in self.users] if self.users else []

        return {'url': f"{os.getenv('API_PATH')}/delivery/{self.id}",
                'id': self.id,
                'name': self.name,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'vehicle': self.vehicle.json_rest(),
                'user' : users
                }


delivers_to_location = db.Table('delivers_to_location', db.metadata,
                        db.Column('location_id', db.Integer, db.ForeignKey(
                            'location.id'), primary_key=True),
                        db.Column('delivery_id', db.Integer, db.ForeignKey(
                            'delivery.id'), primary_key=True)
                        )

user_delivers = db.Table('user_delivers', db.metadata,
                                   db.Column('user_id', db.Integer, db.ForeignKey(
                                       'user.id'), primary_key=True),
                                   db.Column('delivery_id', db.Integer, db.ForeignKey(
                                       'delivery.id'), primary_key=True)
                                   )