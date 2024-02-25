from database.db import db
import os

class Role(db.Model):
    __tablename__ = "role"
    
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(15))

    user = db.relationship('User', secondary='user_is_role', back_populates='role')

    def json(self):
        users = []
        if self.user:
            users = [user.json_rest() for user in self.user]
        return {'role_id': self.role_id, 'role_name': self.role_name, 'users': users}


    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/role/{self.role_id}", 'role_id': self.role_id, 'role_name': self.role_name}  
    

user_is_role = db.Table('user_is_role', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),                                  
    db.Column('role_id', db.Integer, db.ForeignKey('role.role_id'), primary_key=True)
)