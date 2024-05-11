from model.shop import Shop
from model.company import Company
from database.db import db
from app import app
from exception.shop import ShopAccessDbException


class ShopRepo:

    def select_one_by_id(self, shop_id: int) -> Shop:
        try:
            shop = Shop.query.filter_by(id=shop_id).first()
            return shop
        except Exception:
            raise ShopAccessDbException(shop_id=shop_id, method="getting")

    def select_per_page(self, page: int) -> list[Shop]:
        try:
            shops = Shop.query.paginate(page=page, per_page=9)
            if not shops:
                return None

            return {"max_pages": shops.pages, "shops": shops}
        except Exception:
            raise ShopAccessDbException(shop_id=None, method="getting")


    def select_all(self) -> list[Shop]:
        try:
            shops = Shop.query.all()
            if not shops:
                return None
            return shops
        except Exception:
            raise ShopAccessDbException(shop_id=None, method="getting")
        

    def select_by_search(self, page: int, search: str) -> list[Shop]:
        try:
            shops = Shop.query.join(Company).filter(Company.name.like(f'%{search}%') | Shop.name.like(f'%{search}%')).paginate(page=page, per_page=9)
            if not shops:
                return None
            
            return {'max_pages': shops.pages, 'shops': shops}
        except Exception:
            raise ShopAccessDbException(user_id=None, method="getting")


    def insert(self, new_shop: Shop) -> None:
        try:
            with app.app_context():
                db.session.add(new_shop)
                db.session.commit()
                db.session.close()
        except Exception:
            raise ShopAccessDbException(shop_id=None, method="creating")

    def update(self, shop_id: int, update_shop: Shop) -> None:
        try:
            with app.app_context():
                shop = Shop.query.filter_by(id=shop_id).first()
                shop.name = update_shop.name
                shop.company_id = update_shop.company_id
                shop.location_id = update_shop.location_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise ShopAccessDbException(shop_id=shop_id, method="updating")

    def delete(self, shop_id: int) -> None:
        try:
            with app.app_context():
                shop = Shop.query.filter_by(id=shop_id).first()
                db.session.delete(shop)
                db.session.commit()
                db.session.close()
        except Exception:
            raise ShopAccessDbException(shop_id=shop_id, method="deleting")
