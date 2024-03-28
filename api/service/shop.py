from model.shop import Shop
from repository.shop import ShopRepo
from exception.shop import ShopIdNotFoundException
from exception.company import CompanyIdNotFoundException
from exception.location import LocationIdNotFoundException
from service.company import CompanyService
from service.location import LocationService


class ShopService:

    def __init__(self) -> None:
        self.shop_repo = ShopRepo()
        self.company_service = CompanyService()
        self.location_service = LocationService()

    def select_one_by_id(self, shop_id: int):
        shop = self.shop_repo.select_one_by_id(shop_id=shop_id)
        if shop:
            return shop
        else:
            raise ShopIdNotFoundException(shop_id=shop_id)
        
    def select_per_page(self, page: int) -> list[Shop]:
        shops = self.shop_repo.select_per_page(page=page)
        return shops




    def select_all(self):
        shops = self.shop_repo.select_all()
        return shops

    def insert(self, args: dict):
        new_shop = Shop(name=args['name'], company_id=args['company_id'], location_id=args['location_id'])

        if not self.company_service.select_one_by_id(new_shop.company_id):
            raise CompanyIdNotFoundException

        if not self.location_service.select_one_by_id(new_shop.location_id):
            raise LocationIdNotFoundException
        
      
        self.shop_repo.insert(new_shop=new_shop)

    def update(self, shop_id: int, args: dict):
        update_shop = Shop(name=args['name'], company_id=args['company_id'], location_id=args['location_id'])
        shop = self.shop_repo.select_one_by_id(shop_id=shop_id)

        if not shop:
            raise ShopIdNotFoundException(shop_id=shop_id)

        if not self.company_service.select_one_by_id(update_shop.company_id):
            raise CompanyIdNotFoundException

        if not self.location_service.select_one_by_id(update_shop.location_id):
            raise LocationIdNotFoundException
        

        self.shop_repo.update(shop_id=shop_id, update_shop=update_shop)

    def delete(self, shop_id: str):
        if not self.shop_repo.select_one_by_id(shop_id=shop_id):
            raise ShopIdNotFoundException(shop_id=shop_id)
        self.shop_repo.delete(shop_id=shop_id)
