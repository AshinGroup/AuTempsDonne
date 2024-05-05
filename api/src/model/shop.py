from database.db import db
import os

class Shop(db.Model):
    __tablename__ = "shop"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    demands = db.relationship('Demand', backref='shop')
    users = db.relationship('User', backref='shop')
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)

    

    def json(self):
        return {'id': self.id, 
                'name': self.name,
                'company': self.company.json_rest(),
                'location': self.location.json_rest(),
                'users': [user.json_rest() for user in self.users] if self.users else [],
                'demands': [demand.json_rest_shop() for demand in self.demands] if self.demands else []}
    

    def json_rest_company(self):
        return {'url': f"{os.getenv('API_PATH')}/shop/{self.id}", 
                'id': self.id,
                'location': self.location.json_rest(),
                'users': [user.json_rest() for user in self.users] if self.users else [],
                'demands': [demand.json_rest_shop() for demand in self.demands] if self.demands else []}


    def json_rest_location(self):
        return {'url': f"{os.getenv('API_PATH')}/shop/{self.id}", 
                'id': self.id,
                'company': self.company.json_rest(),
                'users': [user.json_rest() for user in self.users] if self.users else [],
                'demands': [demand.json_rest_shop() for demand in self.demands] if self.demands else []}
    
    
    def json_rest_demand(self):
        return {'url': f"{os.getenv('API_PATH')}/shop/{self.id}", 
                'id': self.id,
                'company': self.company.json_rest(),
                'users': [user.json_rest() for user in self.users] if self.users else [],
                'location': self.location.json_rest()}
    

    def json_rest_user(self):
        return {'url': f"{os.getenv('API_PATH')}/shop/{self.id}", 
                'id': self.id,
                'name': self.name,
                'company': self.company.json_rest(),
                'location': self.location.json_rest(),
                'demands': [demand.json_rest_shop() for demand in self.demands] if self.demands else []}
    


