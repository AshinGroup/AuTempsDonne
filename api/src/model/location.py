from database.db import db
import os

class Location(db.Model):
    __tablename__ = "location"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    address = db.Column(db.String(100))
    zip_code = db.Column(db.String(10))
    city = db.Column(db.String(30))
    country = db.Column(db.String(30))
    description = db.Column(db.Text)
    latitude = db.Column(db.String(30))
    longitude = db.Column(db.String(30))
    shops = db.relationship("Shop", backref="location")
    warehouses = db.relationship("Warehouse", backref="location")
    deliveries = db.relationship(
        'Delivery', secondary='delivers_to_location', back_populates='locations')


    def json(self):
        warehouses = [warehouse.json_rest_location() for warehouse in self.warehouses] if self.warehouses else []
    
        shops = [shop.json_rest_location() for shop in self.shops] if self.shops else []
            
        return {'id': self.id, 
                'address': self.address, 
                'zip_code': self.zip_code,
                'city': self.city,
                'country': self.country,
                'warehouses' : warehouses,
                'shops': shops
                }
                
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/location/{self.id}", 
                'id': self.id, 
                'address': self.address,
                'zip_code': self.zip_code}




