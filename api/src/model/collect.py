from database.db import db
import os


class Collect(db.Model):
    __tablename__ = "collect"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    datetime = db.Column(db.DateTime)
    roadmap = db.Column(db.String(200))
    users = db.relationship(
        'User', secondary='user_collects', back_populates='collects')
    
    demands = db.relationship('Demand', backref='collect')
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
 

    def json(self):
        users = [user.json_rest() for user in self.users] if self.users else []
        demands = [demand.json_rest_collect() for demand in self.demands] if self.demands else []

        return {'id': self.id,
                'datetime': self.datetime.strftime("%d/%m/%Y"),
                'roadmap': self.roadmap,
                'vehicle' : self.vehicle.json_rest(),
                'demands': demands,
                'user': users,
                }


    def json_rest_user(self):
        demands = [demand.json_rest_collect() for demand in self.demands] if self.demands else []

        return {'url': f"{os.getenv('API_PATH')}/collect/{self.id}", 
                'id': self.id,
                'datetime': self.datetime.strftime("%d/%m/%Y"),
                'roadmap': self.roadmap,
                'vehicle' : self.vehicle.json_rest(),
                'demands': demands
                }


    def json_rest_vehicle(self):
        users = [user.json_rest() for user in self.users] if self.users else []
        demands = [demand.json_rest_collect() for demand in self.demands] if self.demands else []

        return {'url': f"{os.getenv('API_PATH')}/collect/{self.id}", 
                'id': self.id,
                'datetime': self.datetime.strftime("%d/%m/%Y"),
                'roadmap': self.roadmap,
                'demands': demands,
                'user': users
                }
    
    
user_collects = db.Table('user_collects', db.metadata,
                                   db.Column('user_id', db.Integer, db.ForeignKey(
                                       'user.id'), primary_key=True),
                                   db.Column('collect_id', db.Integer, db.ForeignKey(
                                       'collect.id'), primary_key=True)
                                   )


collects_demand = db.Table('collects_demand', db.metadata,
                                   db.Column('demand_id', db.Integer, db.ForeignKey(
                                       'demand.id'), primary_key=True),
                                   db.Column('collect_id', db.Integer, db.ForeignKey(
                                       'collect.id'), primary_key=True)
                                   )
