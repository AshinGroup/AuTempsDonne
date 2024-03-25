from database.db import db
import os

class Food(db.Model):
    __tablename__ = "food"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text)

    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    packages = db.relationship('Package', backref='package')


    def json(self):
        if self.packages:
            packages = [package.json_rest() for package in self.packages]

        return {'id': self.id, 
                'name' : self.name,
                'description' : self.description,
                'category': self.category.json_rest(),
                'packages': packages}
    

    def json_rest_category(self):
        return {'url': f"{os.getenv('API_PATH')}/food/{self.id}", 
                'id': self.id,
                'name' : self.name}
    
    def json_rest_package(self):
        return {'url': f"{os.getenv('API_PATH')}/food/{self.id}", 
                'id': self.id,
                'name' : self.name,
                'category': self.category.json_rest()}

