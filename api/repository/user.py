from model.user import User
from app import db

def insert(new_user: User):
    db.session.add(new_user)
    
    