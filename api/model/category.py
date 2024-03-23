from database.db import db
import os

class Category(db.Model):
    __tablename__ = "category"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text)

    food = db.relationship('Food', backref='category')


    def json(self):
        food = []
        if self.food:
            food = [event.json_rest() for event in self.food]
            
        return {'id': self.id, 
                'name': self.name, 
                'description': self.description,
                'food': self.food}
    

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/category/{self.id}", 
                'id': self.id, 
                'name': self.name,
                'description': self.description}


