from database.db import db
import os

class Warehouse(db.Model):
    __tablename__ = "warehouse"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    storages = db.relationship('Storage', backref='warehouse')
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    
    

    def json(self):
        storages = [storage.json_rest_warehouse() for storage in self.storages] if self.storages else []
        return {'id': self.id, 
                'name' : self.name,
                'location' : self.location.json_rest(),
                'storages': storages}
    

    def json_rest_location(self):
        storages = [storage.json_rest_warehouse() for storage in self.storages] if self.storages else []
        return {'url': f"{os.getenv('API_PATH')}/warehouse/{self.id}", 
                'id': self.id,
                'name': self.name,
                'storages': storages}
    

    def json_rest_storage(self):
        return {'url': f"{os.getenv('API_PATH')}/warehouse/{self.id}", 
                'id': self.id,
                'name': self.name,
                'location': self.location.json_rest()}

