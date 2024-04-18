from dotenv import find_dotenv, load_dotenv
from app import app
from database.db import db
import os
from model.user import User
from model.event import Event
from model.role import Role
from model.type import Type
from model.location import Location
from model.category import Category
from model.food import Food
from model.package import Package
from model.storage import Storage
from model.warehouse import Warehouse
from model.shop import Shop
from model.company import Company
from model.delivery import Delivery


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
    for i in range(0, 3):
        events.append(Event(name=f"Event_{i}", description="Ceci est un event",
                      datetime="2023-12-20 13:00:00", place="Chez Franck", capacity=20, group=1, type_id=1))
    for i in range(3, 6):
        events.append(Event(name=f"Event_{i}", description="Ceci est un event",
                      datetime="2024-10-20 13:00:00", place="Chez Fred", capacity=25, group=2, type_id=2))
    for i in range(6, 10):
        events.append(Event(name=f"Event_{i}", description="Ceci est un event",
                      datetime="2024-05-12 17:05:00", place="Chez Gautier", capacity=5, group=3, type_id=3))
    for event in events:
        db.session.add(event)

    # Users
    users = []
    for i in range(0, 3):
        users.append(User(first_name=f"Fred_{i}", last_name="Doux", email=f"fred{i}@gmail.com",
                     phone="0650505050", password="@Fredoudou123", status=1))
        users[i].roles.append(roles[0])
        users[i].events.append(events[i])

    for i in range(3, 6):
        users.append(User(first_name=f"Fred_{i}", last_name="Doux", email=f"fred{i}@gmail.com",
                     phone="0650505050", password="@Fredoudou123", status=0))
        users[i].roles.append(roles[1])
        users[i].events.append(events[i])

    for i in range(6, 10):
        users.append(User(first_name=f"Fred_{i}", last_name="Doux", email=f"fred{i}@gmail.com",
                     phone="0650505050", password="@Fredoudou123", status=0))
        users[i].roles.append(roles[2])
        users[i].events.append(events[i])

    for user in users:
        print("FAIT")
        db.session.add(user)

    # Categories
    
    categories = []
    for i in range(3):
        categories.append(Category(name=f"Category_{i}", description="Ceci est une catégorie"))

    for category in categories:
        db.session.add(category)

    # Food 
    foods = []
    for i in range(0, 3):
        foods.append(Food(name=f"Food_{i}", description="Ceci est de la bouffe", category_id=1))
    for i in range(3, 6):
        foods.append(Food(name=f"Food_{i}", description="Ceci est de la bouffe", category_id=2))
    for i in range(6, 10):
        foods.append(Food(name=f"Food_{i}", description="Ceci est de la bouffe", category_id=3))

    for food in foods:
        db.session.add(food)

    # Company
    companies = []
    for i in range(0, 3):
        companies.append(Company(name=f"Company_{i}", description="Ceci est une entreprise"))
    
    for company in companies:
        db.session.add(company)

    # Location
    locations = []
    for i in range (0, 3):
        locations.append(Location(address=f"Address_{i}", zip_code=75010, city="Paris", country="France"))

    for location in locations:
        db.session.add(location)
    

    # Shop
    shops = []
    for i in range(1, 4):
        shops.append(Shop(name=f"Shop_{i}", location_id=i, company_id=i))
    
    for shop in shops:
        db.session.add(shop)

    
    # Warehouse
    warehouses = []
    for i in range (1, 4):
        warehouses.append(Warehouse(name=f"Warehouse_{i}", location_id=i))

    for warehouse in warehouses:
        db.session.add(warehouse)

    # Storage
    storages = []
    for i in range (1, 4):
        storages.append(Storage(name=f"Storage_{i}", warehouse_id=i))

    for storage in storages:
        db.session.add(storage)


    # Package
    packages = []
    for i in range(1, 4):
        packages.append(Package(weight=100, description="Ceci est un paquet", food_id=i, storage_id=1, expiration_date="2023-02-02 17:05:00"))
    for i in range(4, 7):
        packages.append(Package(weight=250, description="Ceci est un paquet", food_id=i, storage_id=2, expiration_date="2026-10-18 17:05:00"))
    for i in range(7, 11):
        packages.append(Package(weight=1000, description="Ceci est un paquet", food_id=i, storage_id=3, expiration_date="2025-03-30 17:05:00"))

    for package in packages:
        db.session.add(package)


    db.session.commit()


load_dotenv(find_dotenv())
# create_database()
db.init_app(app)
with app.app_context():
    # db.drop_all()
    db.create_all()
    init_database()

