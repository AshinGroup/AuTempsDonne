from database.db import db

class User(db.Model):
    __tablename__ = "user"
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    email = db.Column(db.String(320), unique=True)
    phone = db.Column(db.String(50))
    role = db.Column(db.String(15)) # volunteer / beneficiary / admin
    password = db.Column(db.String(64))

    def json(self):
        return {'id' : self.user_id, 'first_name': self.first_name, 'last_name': self.last_name, 'email': self.email, 'password': self.password}