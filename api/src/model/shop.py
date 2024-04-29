from database.db import db
import os

class Shop(db.Model):
    __tablename__ = "shop"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)

    

    def json(self):
        return {'id': self.id, 
                'name': self.name,
                'company': self.company.json_rest(),
                'location': self.location.json_rest()}
    

    def json_rest_company(self):
        return {'url': f"{os.getenv('API_PATH')}/shop/{self.id}", 
                'id': self.id,
                'location': self.location.json_rest()}


    def json_rest_location(self):
        return {'url': f"{os.getenv('API_PATH')}/shop/{self.id}", 
                'id': self.id,
                'company': self.company.json_rest()}
    
    
    def json_rest_collect(self):
        return {'url': f"{os.getenv('API_PATH')}/shop/{self.id}", 
                'id': self.id,
                'company': self.company.json_rest(),
                'location': self.location.json_rest()}
    


