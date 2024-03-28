from model.storage import Storage
from repository.storage import StorageRepo
from exception.storage import StorageIdNotFoundException
from exception.warehouse import WarehouseIdNotFoundException
from service.warehouse import WarehouseService


class StorageService:

    def __init__(self) -> None:
        self.storage_repo = StorageRepo()
        self.warehouse_service = WarehouseService()

    def select_one_by_id(self, storage_id: int):
        storage = self.storage_repo.select_one_by_id(storage_id=storage_id)
        if storage:
            return storage
        else:
            raise StorageIdNotFoundException(storage_id=storage_id)
        
    def select_per_page(self, page: int) -> list[Storage]:
        storages = self.storage_repo.select_per_page(page=page)
        return storages


    def select_all(self):
        storages = self.storage_repo.select_all()
        return storages

    def insert(self, args: dict):
        new_storage = Storage(name=args['name'], warehouse_id=args['warehouse_id'])

        if not self.warehouse_service.select_one_by_id(new_storage.warehouse_id):
            raise WarehouseIdNotFoundException
      
        self.storage_repo.insert(new_storage=new_storage)

    def update(self, storage_id: int, args: dict):
        update_storage = Storage(name=args['name'], warehouse_id=args['warehouse_id'])
        storage = self.storage_repo.select_one_by_id(storage_id=storage_id)

        if not storage:
            raise StorageIdNotFoundException(storage_id=storage_id)

        if not self.warehouse_service.select_one_by_id(update_storage.warehouse_id):
            raise WarehouseIdNotFoundException

        self.storage_repo.update(storage_id=storage_id, update_storage=update_storage)

    def delete(self, storage_id: str):
        if not self.storage_repo.select_one_by_id(storage_id=storage_id):
            raise StorageIdNotFoundException(storage_id=storage_id)
        self.storage_repo.delete(storage_id=storage_id)
