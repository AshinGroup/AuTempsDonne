from dotenv import find_dotenv, load_dotenv
from app import app
from database.db import create_database, db

from model.user import User
from model.event import Event
from model.role import Role
from model.type import Type
from model.location import Location
from model.category import Category
from model.food import Food


def init_database():
    # Roles
    roles = []
    roles.append(Role(name="Admin"))
    roles.append(Role(name="Volunteer"))
    roles.append(Role(name="Beneficiary"))
    for role in roles:
        db.session.add(role)

    # Types
    types = []
    types.append(Type(name="Fête"))
    types.append(Type(name="Random"))
    types.append(Type(name="RandomPlus"))
    for type in types:
        db.session.add(type)

    # Events
    events = []
    for i in range(0,3):
        events.append(Event(name=f"Event_{i}", description="Ceci est un event", datetime="2023-12-20 13:00:00", capacity=20, group=1, type_id=1))
    for i in range(3,6):
        events.append(Event(name=f"Event_{i}", description="Ceci est un event", datetime="2024-10-20 13:00:00", capacity=25, group=2, type_id=2))
    for i in range(6,10):
        events.append(Event(name=f"Event_{i}", description="Ceci est un event", datetime="2024-05-12 17:05:00", capacity=5, group=3, type_id=3))
    for event in events:
        db.session.add(event)
    
    # Users
    users = []
    for i in range(0,3):
        users.append(User(first_name=f"Fred_{i}", last_name="Doux", email=f"fred{i}@gmail.com", phone="0650505050", password="@Fredoudou123", status=1))
        users[i].roles.append(roles[0])
        users[i].events.append(events[i])

    for i in range(3,6):
        users.append(User(first_name=f"Fred_{i}", last_name="Doux", email=f"fred{i}@gmail.com", phone="0650505050", password="@Fredoudou123", status=0))
        users[i].roles.append(roles[1])
        users[i].events.append(events[i])
        
    for i in range(6,10):
        users.append(User(first_name=f"Fred_{i}", last_name="Doux", email=f"fred{i}@gmail.com", phone="0650505050", password="@Fredoudou123", status=0))
        users[i].roles.append(roles[2])
        users[i].events.append(events[i])
    
    for user in users:
        db.session.add(user)

    db.session.commit()


if __name__ == "__main__":
    load_dotenv(find_dotenv())
    create_database()
    db.init_app(app)
    with app.app_context():
        # db.drop_all()
        # db.create_all()
        init_database()