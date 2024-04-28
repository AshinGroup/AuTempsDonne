from model.warehouse import Warehouse
from repository.warehouse import WarehouseRepo
from exception.warehouse import WarehouseIdNotFoundException
from exception.location import LocationIdNotFoundException
from service.location import LocationService


class WarehouseService:

    def __init__(self) -> None:
        self.warehouse_repo = WarehouseRepo()
        self.warehouse_service = LocationService()

    def select_one_by_id(self, warehouse_id: int):
        warehouse = self.warehouse_repo.select_one_by_id(warehouse_id=warehouse_id)
        if warehouse:
            return warehouse
        else:
            raise WarehouseIdNotFoundException(warehouse_id=warehouse_id)
        
    def select_per_page(self, page: int) -> list[Warehouse]:
        warehouses = self.warehouse_repo.select_per_page(page=page)
        return warehouses


    def select_all(self):
        warehouses = self.warehouse_repo.select_all()
        return warehouses

    def insert(self, args: dict):
        new_warehouse = Warehouse(name=args['name'], location_id=args['location_id'])

        if not self.warehouse_service.select_one_by_id(new_warehouse.warehouse_id):
            raise LocationIdNotFoundException
      
        self.warehouse_repo.insert(new_warehouse=new_warehouse)

    def update(self, warehouse_id: int, args: dict):
        update_warehouse = Warehouse(name=args['name'], location_id=args['location_id'])
        warehouse = self.warehouse_repo.select_one_by_id(warehouse_id=warehouse_id)

        if not warehouse:
            raise WarehouseIdNotFoundException(warehouse_id=warehouse_id)

        if not self.warehouse_service.select_one_by_id(update_warehouse.warehouse_id):
            raise LocationIdNotFoundException

        self.warehouse_repo.update(warehouse_id=warehouse_id, update_warehouse=update_warehouse)

    def delete(self, warehouse_id: str):
        if not self.warehouse_repo.select_one_by_id(warehouse_id=warehouse_id):
            raise WarehouseIdNotFoundException(warehouse_id=warehouse_id)
        self.warehouse_repo.delete(warehouse_id=warehouse_id)
