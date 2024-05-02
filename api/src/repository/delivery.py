from model.delivery import Delivery
from model.location import Location
from model.package import Package
from database.db import db
from app import app
from exception.delivery import DeliveryAccessDbException
from model.location import Location


class DeliveryRepo():

    def select_one_by_id(self, delivery_id: int) -> Delivery:
        try:
            delivery = Delivery.query.filter_by(id=delivery_id).first()
            return delivery
        except Exception:
            raise DeliveryAccessDbException(delivery_id=delivery_id, method="getting")


    def select_per_page(self, page: int) -> list[Delivery]:
        try:
            deliveries = Delivery.query.paginate(page=page, per_page=9)
            if not deliveries:
                return None

            return {'max_pages': deliveries.pages, 'deliveries': deliveries}
        except Exception:
            raise DeliveryAccessDbException(delivery_id=None, method="getting")
        

    def select_by_search(self, page: int, search: str) -> list[Delivery]:
        try:
            deliveries = Delivery.query.filter(Delivery.datetime.like(f'%{search}%')).paginate(page=page, per_page=10)
            if not deliveries:
                return None
            
            return {'max_pages': deliveries.pages, 'deliveries': deliveries}
        except Exception:
            raise DeliveryAccessDbException(delivery_id=None, method="getting")
        

    def select_all(self) -> list[Delivery]:
        try:
            deliveries = Delivery.query.all()
            if not deliveries:
                return None
            return deliveries
        except Exception:
            raise DeliveryAccessDbException(delivery_id=None, method="getting")


    def insert(self, new_delivery: Delivery, locations: list[int], packages: list[int]) -> None:
        try:
            with app.app_context():
                db.session.add(new_delivery)
                to_add_locations = Location.query.filter(Location.id.in_(locations)).all()
                for location in to_add_locations:
                    new_delivery.locations.append(location)
                to_add_packages = Package.query.filter(Package.id.in_(packages)).all()
                for package in to_add_packages:
                    new_delivery.packages.append(package)
                db.session.flush()
                new_delivery_id = new_delivery.id
                db.session.commit()
                db.session.close()
                return new_delivery_id
        except Exception:
            raise DeliveryAccessDbException(delivery_id=None, method="creating")
        

    def insert_location(self, delivery_id: int, location_id: int):
        try:
            with app.app_context():
                delivery = Delivery.query.filter_by(id=delivery_id).first()
                location = Location.query.filter_by(id=location_id).first()
                delivery.locations.append(location)
                db.session.commit()
                db.session.close()
        except Exception:
            raise DeliveryAccessDbException(delivery_id=delivery_id, method="inserting")

    def update(self, delivery_id: int, update_delivery: Delivery) -> None:
        try:
            with app.app_context():
                delivery = Delivery.query.filter_by(id=delivery_id).first()
                delivery.datetime = update_delivery.datetime
                db.session.commit()
                db.session.close()
        except Exception:
            raise DeliveryAccessDbException(delivery_id=delivery_id, method="updating")


    def delete(self, delivery_id: int) -> None:
        try:
            with app.app_context():
                delivery = Delivery.query.filter_by(id=delivery_id).first()
                db.session.delete(delivery)
                db.session.commit()
                db.session.close()
        except Exception:
            raise DeliveryAccessDbException(delivery_id=delivery_id, method="deleting")


    def delete_location(self, delivery_id: int, location_id: int):
        try:
            with app.app_context():
                delivery = Delivery.query.filter_by(id=delivery_id).first()
                location = Location.query.filter_by(id=location_id).first()
                delivery.locations.remove(location)
                db.session.commit()
                db.session.close()
        except Exception:
            raise DeliveryAccessDbException(delivery_id=delivery_id, method="deleting")