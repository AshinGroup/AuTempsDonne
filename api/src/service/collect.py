from model.collect import Collect
from repository.collect import CollectRepo
from exception.collect import CollectIdNotFoundException, CollectIdGroupNotFoundException
from exception.shop import ShopIdNotFoundException
from service.shop import ShopService


class CollectService:

    def __init__(self) -> None:
        self.collect_repo = CollectRepo()
        self.shop_service = ShopService()


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
        new_collect = Collect(submitted_datetime=args['submitted_datetime'], limit_datetime=args['limit_datetime'], status=args['status'],
                          additional=args['additional'], shop_id=args['shop_id'])
        if new_collect.status < 0 or new_collect.status > 2:
            raise CollectIdGroupNotFoundException
        if not self.shop_service.select_one_by_id(new_collect.shop_id):
            raise ShopIdNotFoundException
        self.shop_service.select_one_by_id(shop_id=new_collect.shop_id)
        self.collect_repo.insert(new_collect=new_collect)


    def update(self, collect_id: int, args: dict):
        update_collect = Collect(submitted_datetime=args['submitted_datetime'], limit_datetime=args['limit_datetime'], status=args['status'],
                          additional=args['additional'], shop_id=args['shop_id'])
        collect = self.collect_repo.select_one_by_id(collect_id=collect_id)

        if update_collect.status < 0 or update_collect.status > 2:
            raise CollectIdStatusNotFoundException

        if not collect:
            raise CollectIdNotFoundException(collect_id=collect_id)

        if not self.shop_service.select_one_by_id(update_collect.shop_id):
            raise ShopIdNotFoundException

        self.shop_service.select_one_by_id(shop_id=update_collect.shop_id)

        self.collect_repo.update(collect_id=collect_id, update_collect=update_collect)


    def delete(self, collect_id: str):
        if not self.collect_repo.select_one_by_id(collect_id=collect_id):
            raise CollectIdNotFoundException(collect_id=collect_id)
        self.collect_repo.delete(collect_id=collect_id)
