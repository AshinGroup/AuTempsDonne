from database.db import db
import os

class Role(db.Model):
    __tablename__ = "role"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(15))

    users = db.relationship('User', secondary='user_is_role', back_populates='roles')

    def json(self):
        users = []
        if self.users:
            users = [user.json_rest() for user in self.users]
        return {'id': self.role_id, 
                'name': self.role_name, 
                'users': users}


    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/role/{self.id}", 
                'role_id': self.id, 
                'role_name': self.name}  
    

user_is_role = db.Table('user_is_role', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),                                  
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True)
)