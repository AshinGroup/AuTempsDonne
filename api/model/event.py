from database.db import db
import os


class Event(db.Model):
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    datetime = db.Column(db.DateTime)
    description = db.Column(db.Text)
    capacity = db.Column(db.Integer)
    # 0 = All / 1 = Activity / 2 = Course / 3 = Service
    group = db.Column(db.Integer)
    place = db.Column(db.String(200))

    type_id = db.Column(db.Integer, db.ForeignKey('type.id'), nullable=False)
    # location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    users = db.relationship(
        'User', secondary='user_participates_event', back_populates='events')

    # def event_group_name(self, event: int):
    #     if event == 1:
    #         return 'Activity'
    #     elif event == 2:
    #         return 'Course'
    #     elif event == 3:
    #         return 'Service'
    #     else:
    #         return 'Nameless'

    def json(self):
        users = [user.json_rest() for user in self.users] if self.users else []
        # event_name = self.event_group_name(self.group)

        return {'id': self.id,
                'name': self.name,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'description': self.description,
                'capacity': self.capacity,
                'group': self.group,
                'place': self.place,
                'type': {
                    'url': f"{os.getenv('API_PATH')}/type/{self.type_id}",
                    'id': self.type.id,
                    'name': self.type.name
                },
                'users': users}

    def json_rest(self):
        # event_name = self.event_group_name(self.group)
        return {'url': f"{os.getenv('API_PATH')}/event/{self.id}",
                'id': self.id,
                'name': self.name,
                'place': self.place,
                'group': self.group,
                'datetime': self.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'description': self.description,
                'type': {
                    'url': f"{os.getenv('API_PATH')}/type/{self.type_id}",
                    'id': self.type.id,
                    'name': self.type.name
                },
                }


user_participates_event = db.Table('user_participates_event', db.metadata,
                                   db.Column('user_id', db.Integer, db.ForeignKey(
                                       'user.id'), primary_key=True),
                                   db.Column('event_id', db.Integer, db.ForeignKey(
                                       'event.id'), primary_key=True)
                                   )
