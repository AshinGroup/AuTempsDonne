from model.delivery import Delivery
from repository.delivery import DeliveryRepo
from exception.delivery import DeliveryIdNotFoundException, DeliveryIdGroupNotFoundException
from exception.type import UserIdNotFoundException
from service.type import UserService
from service.roadmap import RoadmapService



class DeliveryService:

    def __init__(self) -> None:
        self.delivery_repo = DeliveryRepo()
        self.type_service = UserService()

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
        new_delivery = Delivery(datetime=args['datetime'], user_id=args['user_id'])

        if not self.type_service.select_one_by_id(new_delivery.type_id):
            raise UserIdNotFoundException
        self.type_service.select_one_by_id(type_id=new_delivery.type_id)
        self.delivery_repo.insert(new_delivery=new_delivery)

    def insert_location(self, user_id: int, location_id: int):



    def update(self, delivery_id: int, args: dict):
        update_delivery = Delivery(name=args['name'], datetime=args['datetime'], description=args['description'],
                             capacity=args['capacity'], group=args['group'], type_id=args['type_id'], place=args['place'])
        delivery = self.delivery_repo.select_one_by_id(delivery_id=delivery_id)

        if update_delivery.group < 1 or update_delivery.group > 3:
            raise DeliveryIdGroupNotFoundException

        if not delivery:
            raise DeliveryIdNotFoundException(delivery_id=delivery_id)

        if not self.type_service.select_one_by_id(update_delivery.type_id):
            raise UserIdNotFoundException

        self.type_service.select_one_by_id(type_id=update_delivery.type_id)

        self.delivery_repo.update(delivery_id=delivery_id, update_delivery=update_delivery)

    def delete(self, delivery_id: str):
        if not self.delivery_repo.select_one_by_id(delivery_id=delivery_id):
            raise DeliveryIdNotFoundException(delivery_id=delivery_id)
        self.delivery_repo.delete(delivery_id=delivery_id)
