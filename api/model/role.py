from database.db import db

class Role(db.Model):
    __tablename__ = "role"
    
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(15))

    user = db.relationship('User', secondary='user_is_role', back_populates='role')

    def json(self):
        return {'role_id': self.role_id, 'role_name': self.role_name} 
    

user_is_role = db.Table('user_is_role', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),                                  
    db.Column('role_id', db.Integer, db.ForeignKey('role.role_id'), primary_key=True)
)