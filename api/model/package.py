from database.db import db
import os

class Package(db.Model):
    __tablename__ = "package"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    weight = db.Column(db.Integer)
    description = db.Column(db.Text)
    expiration_date = db.Column(db.DateTime)
    food_id = db.Column(db.Integer, db.ForeignKey('food.id'), nullable=False)
    # delivery_id = db.Column(db.Integer, db.ForeignKey('delivery.id'), nullable=True)
    

    def json(self):
        return {'id': self.id, 
                'weight': self.weight,
                'name' : self.food.name,
                'description' : self.description,
                'expiration_date' : self.expiration_date}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/package/{self.id}", 
                'id': self.id,
                'name' : self.food.name,
                'description' : self.description,
                'expiration_date' : self.expiration_date}

