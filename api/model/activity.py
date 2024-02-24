from database.db import db

class Activity(db.Model):
    __tablename__ = "activity"
    
    activity_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(30))  # Revoir si l'on passe le type en int ?
    date = db.Column(db.DateTime)
    activity_location = db.Column(db.Text)

    def json(self):
        return {'activity_id': self.activity_id, 'type': self.type, 'date': date, 'activity_location' : self.activity_location}
