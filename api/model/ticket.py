from database.db import db
import os


class Ticket(db.Model):
    __tablename__ = "ticket"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    subject = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.Integer)
    type = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    def json(self):

        return {'id': self.id,
                'subject': self.subject,
                'description': self.description,
                'status': self.status,
                'type': self.type,
                'user': self.user.json_rest(),
                'admin': self.admin.json_rest() if self.admin else None}

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/ticket/{self.id}",
                'id': self.id,
                'subject': self.subject,
                'description': self.description,
                'status': self.status,
                'type': self.type,
                }


