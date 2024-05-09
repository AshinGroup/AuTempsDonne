from model.collect import Collect
from repository.collect import CollectRepo
from exception.collect import *
from exception.demand import CollectsDemandAlreadyExistsException
from exception.vehicle import VehicleIdNotFoundException
from service.vehicle import VehicleService
from service.demand import DemandService
from service.storage import StorageService
from service.roadmap import RoadmapService
from service.wasabi_s3 import WasabiS3


class CollectService:

    def __init__(self) -> None:
        self.collect_repo = CollectRepo()
        self.vehicle_service = VehicleService()
        self.demand_service = DemandService()
        self.storage_service = StorageService()
        self.roadmap_service = RoadmapService()
        self.wasabi_service = WasabiS3()


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
        locations = list()
        new_collect = Collect(datetime=args['datetime'], roadmap=None, vehicle_id=args['vehicle_id'], storage_id=args['storage_id'])
        self.vehicle_service.select_one_by_id(vehicle_id=new_collect.vehicle_id)
        
        storage = self.storage_service.select_one_by_id(new_collect.storage_id)
        locations.append(storage.warehouse.location_id)
        for demand_id in args['demands']:
            check_demand = self.demand_service.select_one_by_id(demand_id=demand_id)
            if check_demand.collect_id:
                raise CollectsDemandAlreadyExistsException(demand_id=demand_id)
            locations.append(check_demand.shop.location_id)
        roadmap = self.roadmap_service.generate_roadmap(locations_id=locations, type="collect")
        new_collect.roadmap = roadmap['roadmap_src']
        new_collect.pdf = roadmap['pdf_src']
        self.collect_repo.insert(new_collect=new_collect, demands=args['demands'])


    def update(self, collect_id: int, args: dict):
        update_collect = Collect(datetime=args['datetime'], roadmap=None, vehicle_id=args['vehicle_id'], storage_id=args['storage_id'])
        self.storage_service.select_one_by_id(update_collect.storage_id)
        self.select_one_by_id(collect_id=collect_id)
       
        if not self.vehicle_service.select_one_by_id(update_collect.vehicle_id):
            raise VehicleIdNotFoundException

        self.vehicle_service.select_one_by_id(vehicle_id=update_collect.vehicle_id)

        self.collect_repo.update(collect_id=collect_id, update_collect=update_collect)


    def delete(self, collect_id: str):
        collect = self.select_one_by_id(collect_id=collect_id)
        self.wasabi_service.delete_file(collect.roadmap)
        self.collect_repo.delete(collect_id=collect_id)

