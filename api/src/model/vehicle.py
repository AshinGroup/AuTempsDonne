from database.db import db
import os

class Vehicle(db.Model):
    __tablename__ = "vehicle"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    license_plate = db.Column(db.String(15))
    brand = db.Column(db.String(50))
    type = db.Column(db.Integer) # 1 = Camion, 2 = Moto, 3 = Voiture, 4 = Autres
    collects = db.relationship('Collect', backref='vehicle')
    deliveries = db.relationship('Delivery', backref='vehicle')


    def json(self):
        collects = [collect.json_rest_vehicle() for collect in self.collects] if self.collects else []
        deliveries = [delivery.json_rest() for delivery in self.deliveries] if self.deliveries else []
        
        return {'id': self.id, 
                'license_plate': self.license_plate, 
                'brand': self.brand,
                'type': self.type,
                'deliveries': deliveries,
                'collects': collects
                }
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/vehicle/{self.id}", 
                'id': self.id, 
                'license_plate': self.license_plate,
                'brand': self.brand,
                'type': self.type,
                }


