from database.db import db
import os


class Collect(db.Model):
    __tablename__ = "collect"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    datetime = db.Column(db.DateTime)
    roadmap = db.Column(db.String(200))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
 

    def json(self):
        return {'id': self.id,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'roadmap': self.roadmap,
                'user': self.user.json_collect(),
                'vehicle' : self.vehicle.json_collect()
                }


    def json_rest_user(self):
        return {'id': self.id,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'roadmap': self.roadmap,
                'vehicle' : self.vehicle.json_collect()
                }

    def json_rest_vehicle(self):
        return {'id': self.id,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'roadmap': self.roadmap,
                'user': self.user.json_collect()
                }

