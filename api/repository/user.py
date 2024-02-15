from model.user import User
from database.db import db
from app import app


class UserRepo():
    def insert(self, new_user: User):
        with app.app_context():
            db.session.add(new_user)
            a = db.session.commit()
            print(a)
            
        
    
    