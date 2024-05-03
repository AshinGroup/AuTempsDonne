from database.db import db
import os

class Storage(db.Model):
    __tablename__ = "storage"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    packages = db.relationship('Package', backref='storage')
    collects = db.relationship('Collect', backref='storage')
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouse.id'), nullable=False)
    
    

    def json(self):
        packages = [package.json_rest_storage() for package in self.packages] if self.packages else []
        collects = [collect.json_rest_storage() for collect in self.collects] if self.collects else []

        return {'id': self.id, 
                'name' : self.name,
                'packages': packages,
                'collects': collects,
                'warehouse': self.warehouse.json_rest_storage()}
    

    def json_rest_package(self):
        collects = [collect.json_rest_storage() for collect in self.collects] if self.collects else []
        return {'url': f"{os.getenv('API_PATH')}/storage/{self.id}", 
                'id': self.id,
                'name': self.name,
                'warehouse': self.warehouse.json_rest_storage(),
                'collects': collects}
    

    def json_rest_warehouse(self):
        packages = [package.json_rest_storage() for package in self.packages] if self.packages else []
        collects = [collect.json_rest_storage() for collect in self.collects] if self.collects else []

        return {'url': f"{os.getenv('API_PATH')}/storage/{self.id}", 
                'id': self.id,
                'name': self.name,
                'packages': packages,
                'collects': collects}

    def json_rest_collect(self):
        packages = [package.json_rest_storage() for package in self.packages] if self.packages else []

        return {'url': f"{os.getenv('API_PATH')}/storage/{self.id}", 
                'id': self.id,
                'name': self.name,
                'warehouse': self.warehouse.json_rest_storage(),
                'packages': packages,
                }


