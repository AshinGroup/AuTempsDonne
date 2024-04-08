from database.db import db
import os

class Category(db.Model):
    __tablename__ = "category"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text)

    food = db.relationship('Food', backref='category')


    def json(self):
        food_list = [food.json_rest_category() for food in self.food] if self.food else []
            
        return {'id': self.id, 
                'name': self.name, 
                'description': self.description,
                'food': food_list}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/category/{self.id}", 
                'id': self.id, 
                'name': self.name}


