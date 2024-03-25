from database.db import db
import os

class Package(db.Model):
    __tablename__ = "package"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    weight = db.Column(db.Float)
    description = db.Column(db.Text)
    expiration_date = db.Column(db.DateTime)
    food_id = db.Column(db.Integer, db.ForeignKey('food.id'), nullable=False)
    # delivery_id = db.Column(db.Integer, db.ForeignKey('delivery.id'), nullable=True)
    

    def json(self):

        return {'id': self.id, 
                'weight': self.weight,
                'description' : self.description,
                'expiration_date' : self.expiration_date.strftime("%Y-%m-%d %H:%M:%S"),
                'food': self.food.json_rest_package()}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/package/{self.id}", 
                'id': self.id,
                'expiration_date' : self.expiration_date.strftime("%Y-%m-%d %H:%M:%S")}

