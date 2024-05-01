from model.vehicle import Vehicle
from repository.vehicle import VehicleRepo
from exception.vehicle import VehicleIdNotFoundException

class VehicleService:

    def __init__(self) -> None:
        self.vehicle_repo = VehicleRepo()


    def select_one_by_id(self, vehicle_id: int):
        vehicle = self.vehicle_repo.select_one_by_id(vehicle_id=vehicle_id)
        if vehicle:
            return vehicle
        else:
            raise VehicleIdNotFoundException(vehicle_id=vehicle_id)
        

    def select_all(self):
        events = self.vehicle_repo.select_all()
        return events


    def insert(self, args: dict):
        new_vehicle = Vehicle(name=args['license_plate'], brand=args['brand'], type=args['license_plate'])
        self.vehicle_repo.insert(new_vehicle=new_vehicle)
    

    def update(self, vehicle_id: int, args: dict):
        update_vehicle = Vehicle(name=args['license_plate'], brand=args['brand'], type=args['license_plate'])
        vehicle = self.vehicle_repo.select_one_by_id(vehicle_id=vehicle_id)
        
        if not vehicle:
            raise VehicleIdNotFoundException(vehicle_id=vehicle_id)
        
        self.vehicle_repo.update(vehicle_id=vehicle_id, update_vehicle=update_vehicle)
        
        
    def delete(self, vehicle_id: str):
        if not self.vehicle_repo.select_one_by_id(vehicle_id=vehicle_id):
            raise VehicleIdNotFoundException(vehicle_id=vehicle_id)
        self.vehicle_repo.delete(vehicle_id=vehicle_id)
