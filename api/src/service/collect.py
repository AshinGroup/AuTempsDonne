from model.collect import Collect
from repository.collect import CollectRepo
from exception.collect import *
from exception.vehicle import VehicleIdNotFoundException
from service.vehicle import VehicleService
from service.demand import DemandService


class CollectService:

    def __init__(self) -> None:
        self.collect_repo = CollectRepo()
        self.vehicle_service = VehicleService()
        self.demand_service = DemandService()

    def select_one_by_id(self, collect_id: int):
        collect = self.collect_repo.select_one_by_id(collect_id=collect_id)
        if collect:
            return collect
        else:
            raise CollectIdNotFoundException(collect_id=collect_id)
        
    def select_per_page(self, page: int) -> list[Collect]:
        collects = self.collect_repo.select_per_page(page=page)
        return collects

    def select_by_search(self, page: int, search: str) -> list[Collect]:
        collects = self.collect_repo.select_by_search(page=page, search=search)
        return collects


    def select_all(self):
        collects = self.collect_repo.select_all()
        return collects

    def insert(self, args: dict):
        new_collect = Collect(datetime=args['datetime'], roadmap=None, vehicle_id=args['vehicle_id'])
        self.vehicle_service.select_one_by_id(new_collect.vehicle_id)
        for demand_id in args['demands']:
            self.demand_service.select_one_by_id(demand_id=demand_id)
        self.vehicle_service.select_one_by_id(vehicle_id=new_collect.vehicle_id)
        self.collect_repo.insert(new_collect=new_collect, demands=args['demands'])


    def insert_demand(self, collect_id: int, demand_id: int):
        collect = self.select_one_by_id(collect_id=collect_id)
        if collect.demands:
            for demand in collect.demands:
                if demand.id == demand_id:
                    raise CollectsDemandAlreadyExistsException(collect_id=collect_id, demand_id=demand_id)
        self.demand_service.select_one_by_id(demand_id=demand_id)
        self.collect_repo.insert_demand(collect_id=collect_id, demand_id=demand_id)  
                    



    def update(self, collect_id: int, args: dict):
        update_collect = Collect(datetime=args['datetime'], roadmap=None, vehicle_id=args['vehicle_id'])
        collect = self.collect_repo.select_one_by_id(collect_id=collect_id)

        if not collect:
            raise CollectIdNotFoundException(collect_id=collect_id)

        if not self.vehicle_service.select_one_by_id(update_collect.vehicle_id):
            raise VehicleIdNotFoundException

        self.vehicle_service.select_one_by_id(vehicle_id=update_collect.vehicle_id)

        self.collect_repo.update(collect_id=collect_id, update_collect=update_collect)


    def delete(self, collect_id: str):
        if not self.collect_repo.select_one_by_id(collect_id=collect_id):
            raise CollectIdNotFoundException(collect_id=collect_id)
        self.collect_repo.delete(collect_id=collect_id)


    def delete_demand(self, collect_id: int, demand_id: int) -> None:
        collect = self.select_one_by_id(collect_id=collect_id)
        demand_exist = False
        if collect.demands:
            for demand in collect.demands:
                if demand.id == demand_id:
                    demand_exist = True
                    break
        if not demand_exist:
            raise CollectsDemandNotFoundException(
                collect_id=collect_id, demand_id=demand_id)
        self.collect_repo.delete_demand(collect_id=collect_id, demand_id=demand_id)