from database.db import db
import os

class Company(db.Model):
    __tablename__ = "company"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text)

    shops = db.relationship('Shop', backref='company')


    def json(self):
        shops = [shop.json_rest_company() for shop in self.shops] if self.shops else []
            
        return {'id': self.id, 
                'name': self.name, 
                'description': self.description,
                'shop': shops}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/company/{self.id}", 
                'id': self.id, 
                'name': self.name}


