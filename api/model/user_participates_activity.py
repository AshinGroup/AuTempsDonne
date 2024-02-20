from database.db import db

class User_participates_activity(db.Model):
    __tablename__ = "user_participates_activity"
    
    user_participates_activity_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer)
    activity_id = db.Column(db.Integer)