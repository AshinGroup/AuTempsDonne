from database.db import db
import os

class Storage(db.Model):
    __tablename__ = "storage"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    packages = db.relationship('Package', backref='storage')
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    
    

    def json(self):
        packages = []
        if self.packages:
            packages = [package.json_rest_storage() for package in self.packages]
        return {'id': self.id, 
                'name' : self.name,
                'packages': packages,
                'warehouse': self.warehouse.json_rest_storage()}
    

    def json_rest_package(self):
        return {'url': f"{os.getenv('API_PATH')}/storage/{self.id}", 
                'id': self.id,
                'name': self.name,
                'warehouse': self.warehouse.json_rest_storage()}
    

    def json_rest_warehouse(self):
        if self.packages:
            packages = [package.json_rest_storage() for package in self.packages]
        return {'url': f"{os.getenv('API_PATH')}/storage/{self.id}", 
                'id': self.id,
                'name': self.name,
                'packages': packages}
