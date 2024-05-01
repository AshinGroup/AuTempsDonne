from model.delivery import Delivery
from repository.delivery import DeliveryRepo
from exception.delivery import DeliveryIdNotFoundException, DeliversToLocationAlreadyExistsException, DeliversToLocationNotFoundException
from service.location import LocationService
from service.vehicle import VehicleService



class DeliveryService:

    def __init__(self) -> None:
        self.delivery_repo = DeliveryRepo()
        self.location_service = LocationService()
        self.vehicle_service = VehicleService()

    def select_one_by_id(self, delivery_id: int):
        delivery = self.delivery_repo.select_one_by_id(delivery_id=delivery_id)
        if delivery:
            return delivery
        else:
            raise DeliveryIdNotFoundException(delivery_id=delivery_id)
        
    def select_per_page(self, page: int) -> list[Delivery]:
        deliveries = self.delivery_repo.select_per_page(page=page)
        return deliveries

    def select_by_search(self, page: int, search: str) -> list[Delivery]:
        deliveries = self.delivery_repo.select_by_search(page=page, search=search)
        return deliveries


    def select_all(self):
        deliveries = self.delivery_repo.select_all()
        return deliveries


    def insert(self, args: dict):
        new_delivery = Delivery(datetime=args['datetime'], status=args['status'], roadmap=None, vehicle_id=args['vehicle_id'])
        self.delivery_repo.select_one_by_id(delivery_id=new_delivery.id)
        for location_id in args['locations']:
            self.location_service.select_one_by_id(location_id=location_id)
        self.vehicle_service.select_one_by_id(vehicle_id=new_delivery.vehicle_id)

        new_delivery_id = self.delivery_repo.insert(new_delivery=new_delivery, locations=args['locations'])

        return new_delivery_id


    def insert_location(self, delivery_id: int, location_id: int):
        delivery = self.select_one_by_id(delivery_id=delivery_id)
        if delivery.locations:
            for location in delivery.locations:
                if location.id == location_id:
                    raise DeliversToLocationAlreadyExistsException(delivery_id=delivery_id, location_id=location_id)
        self.location_service.select_one_by_id(location_id=location_id)
        self.delivery_repo.insert_location(delivery_id=delivery_id, location_id=location_id)  
                    


    def update(self, delivery_id: int, args: dict):
        update_delivery = Delivery(datetime=args['datetime'], status=args['status'], roadmap=None, vehicle_id=args['vehicle_id'])
        self.delivery_repo.select_one_by_id(delivery_id=delivery_id)
        self.vehicle_service.select_one_by_id(vehicle_id=update_delivery.vehicle_id)

        self.delivery_repo.update(delivery_id=delivery_id, update_delivery=update_delivery)


    def delete(self, delivery_id: str):
        if not self.delivery_repo.select_one_by_id(delivery_id=delivery_id):
            raise DeliveryIdNotFoundException(delivery_id=delivery_id)
        self.delivery_repo.delete(delivery_id=delivery_id)


    def delete_location(self, delivery_id: int, location_id: int) -> None:
        delivery = self.select_one_by_id(delivery_id=delivery_id)
        location_exist = False
        if delivery.locations:
            for location in delivery.locations:
                if location.id == location_id:
                    location_exist = True
                    break
        if not location_exist:
            raise DeliversToLocationNotFoundException(
                delivery_id=delivery_id, location_id=location_id)
        self.delivery_repo.delete_location(delivery_id=delivery_id, location_id=location_id)