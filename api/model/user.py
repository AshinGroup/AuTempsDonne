from app import db
try:
    from api.model.base import Base
except:
    from model.base import Base


class User(Base):
    __tablename__ = "user"
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    mail = db.Column(db.String(320), unique=True)
    phone = db.Column(db.String(50))
    role = db.Column(db.String(15)) # volunteer / beneficiary / admin

