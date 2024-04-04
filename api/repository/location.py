from model.location import Location
from database.db import db
from app import app
from exception.location import LocationAccessDbException

class LocationRepo():    

    def select_one_by_id(self, location_id: int) -> Location:
        try:
            location = Location.query.filter_by(id=location_id).first()
            return location
        except Exception:
            raise LocationAccessDbException(location_id=location_id, method="getting")

    
    def select_all(self) -> list[Location]:
        try:
            locations = Location.query.all()
            if not locations:
                return None
            return locations
        except Exception:
            raise LocationAccessDbException(location_id=None, method="getting")


    def insert(self, new_location: Location) -> None:
        try:
            with app.app_context():
                db.session.add(new_location)
                db.session.flush()
                new_location_id = new_location.id
                db.session.commit()
                db.session.close()
                return new_location_id
        except Exception:
            raise LocationAccessDbException(location_id=None, method="creating")
    


    def update(self, location_id: int, update_location: Location) -> None:
        try:
            with app.app_context():
                location = Location.query.filter_by(id=location_id).first()
                location.address = update_location.address
                location.zip_code = update_location.zip_code
                location.city = update_location.city
                location.country = update_location.country
                db.session.commit()
                db.session.close()
        except Exception:
            raise LocationAccessDbException(location_id=location_id, method="updating")


    def delete(self, location_id: int) -> None:
        try:
            with app.app_context():
                location = Location.query.filter_by(id=location_id).first()
                db.session.delete(location)
                db.session.commit()
                db.session.close()
        except Exception:
            raise LocationAccessDbException(location_id=location_id, method="deleting")