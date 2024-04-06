from database.db import db
import os


class Ticket(db.Model):
    __tablename__ = "ticket"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    subject = db.Column(db.String(50))
    description = db.Column(db.Text)
    status = db.Column(db.Integer)

    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    users = db.relationship(
        'User', secondary='user_writes_ticket', back_populates='tickets')

    def json(self):
        users = []
        if self.users:
            users = [user.json_rest() for user in self.users]

        return {'id': self.id,
                'subject': self.subject,
                'description': self.description,
                'status': self.status,
                'users': users}

    def json_rest(self):
        return {'url': f"{os.getenv('API_PATH')}/ticket/{self.id}",
                'id': self.id,
                'subject': self.subject,
                'description': self.description,
                'status': self.status,
                }


user_writes_ticket = db.Table('user_writes_ticket', db.metadata,
                                   db.Column('user_id', db.Integer, db.ForeignKey(
                                       'user.id'), primary_key=True),
                                   db.Column('ticket_id', db.Integer, db.ForeignKey(
                                       'ticket.id'), primary_key=True)
                                   )
