from model.demand import Demand
from repository.demand import DemandRepo
from exception.demand import DemandIdNotFoundException
from exception.shop import ShopIdNotFoundException
from service.shop import ShopService


class DemandService:

    def __init__(self) -> None:
        self.demand_repo = DemandRepo()
        self.shop_service = ShopService()


    def select_one_by_id(self, demand_id: int):
        demand = self.demand_repo.select_one_by_id(demand_id=demand_id)
        if demand:
            return demand
        else:
            raise DemandIdNotFoundException(demand_id=demand_id)
        

    def select_per_page(self, page: int) -> list[Demand]:
        demands = self.demand_repo.select_per_page(page=page)
        return demands


    def select_by_search(self, page: int, search: str) -> list[Demand]:
        demands = self.demand_repo.select_by_search(page=page, search=search)
        return demands


    def select_all(self):
        demands = self.demand_repo.select_all()
        return demands


    def insert(self, args: dict):
        new_demand = Demand(submitted_datetime=args['submitted_datetime'], limit_datetime=args['limit_datetime'], status=args['status'],
                          additional=args['additional'], shop_id=args['shop_id'])

        if not self.shop_service.select_one_by_id(new_demand.shop_id):
            raise ShopIdNotFoundException
        self.shop_service.select_one_by_id(shop_id=new_demand.shop_id)
        self.demand_repo.insert(new_demand=new_demand)


    def update(self, demand_id: int, args: dict):
        update_demand = Demand(submitted_datetime=args['submitted_datetime'], limit_datetime=args['limit_datetime'], status=args['status'],
                          additional=args['additional'], shop_id=args['shop_id'])
        demand = self.demand_repo.select_one_by_id(demand_id=demand_id)

        if not demand:
            raise DemandIdNotFoundException(demand_id=demand_id)

        if not self.shop_service.select_one_by_id(update_demand.shop_id):
            raise ShopIdNotFoundException

        self.shop_service.select_one_by_id(shop_id=update_demand.shop_id)

        self.demand_repo.update(demand_id=demand_id, update_demand=update_demand)


    def delete(self, demand_id: str):
        if not self.demand_repo.select_one_by_id(demand_id=demand_id):
            raise DemandIdNotFoundException(demand_id=demand_id)
        self.demand_repo.delete(demand_id=demand_id)
