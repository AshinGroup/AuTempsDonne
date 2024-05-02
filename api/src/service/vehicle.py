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
        vehicles = self.vehicle_repo.select_all()
        return vehicles

    def insert(self, args: dict):
        new_vehicle = Vehicle(
            license_plate=args['license_plate'], brand=args['brand'], type=args['type'])
        self.vehicle_repo.insert(new_vehicle=new_vehicle)

    def update(self, vehicle_id: int, args: dict):
        update_vehicle = Vehicle(
            license_plate=args['license_plate'], brand=args['brand'], type=args['type'])
        vehicle = self.vehicle_repo.select_one_by_id(vehicle_id=vehicle_id)

        if not vehicle:
            raise VehicleIdNotFoundException(vehicle_id=vehicle_id)

        self.vehicle_repo.update(
            vehicle_id=vehicle_id, update_vehicle=update_vehicle)

    def delete(self, vehicle_id: str):
        if not self.vehicle_repo.select_one_by_id(vehicle_id=vehicle_id):
            raise VehicleIdNotFoundException(vehicle_id=vehicle_id)
        self.vehicle_repo.delete(vehicle_id=vehicle_id)
