from database.db import db

user_participates_activity = db.Table('user_participates_activity',
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), primary_key=True),                                  
    activity_id = db.Column(db.Integer, db.ForeignKey('activity.activity_id'), primary_key=True)
)