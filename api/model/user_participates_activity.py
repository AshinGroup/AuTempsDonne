from database.db import db

user_participates_activity = db.Table('user_participates_activity', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),                                  
    db.Column('activity_id', db.Integer, db.ForeignKey('activity.activity_id'), primary_key=True)
)