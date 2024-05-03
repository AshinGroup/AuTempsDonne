from model.vehicle import Vehicle
from database.db import db
from app import app
from exception.vehicle import VehicleAccessDbException

class VehicleRepo():    

    def select_one_by_id(self, vehicle_id: int) -> Vehicle:
        try:
            vehicle = Vehicle.query.filter_by(id=vehicle_id).first()
            return vehicle
        except Exception:
            raise VehicleAccessDbException(vehicle_id=vehicle_id, method="getting")

    
    def select_all(self) -> list[Vehicle]:
        try:
            vehicles = Vehicle.query.all()
            if not vehicles:
                return None
            return vehicles
        except Exception:
            raise VehicleAccessDbException(vehicle_id=None, method="getting")


    def insert(self, new_vehicle: Vehicle) -> None:
        try:
            with app.app_context():
                db.session.add(new_vehicle)
                db.session.commit()
                db.session.close()
        except Exception:
            raise VehicleAccessDbException(vehicle_id=None, method="creating")
    

    def update(self, vehicle_id: int, update_vehicle: Vehicle) -> None:
        try:
            with app.app_context():
                vehicle = Vehicle.query.filter_by(id=vehicle_id).first()
                vehicle.license_plate = update_vehicle.license_plate
                vehicle.type = update_vehicle.type
                vehicle.brand = update_vehicle.brand
                db.session.commit()
                db.session.close()
        except Exception:
            raise VehicleAccessDbException(vehicle_id=vehicle_id, method="updating")


    def delete(self, vehicle_id: int) -> None:
        try:
            with app.app_context():
                vehicle = Vehicle.query.filter_by(id=vehicle_id).first()
                db.session.delete(vehicle)
                db.session.commit()
                db.session.close()
        except Exception:
            raise VehicleAccessDbException(vehicle_id=vehicle_id, method="deleting")