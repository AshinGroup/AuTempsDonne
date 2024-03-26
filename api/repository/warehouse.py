from model.warehouse import Warehouse
from database.db import db
from app import app
from exception.warehouse import WarehouseAccessDbException

class WarehouseRepo():    

    def select_one_by_id(self, warehouse_id: int) -> Warehouse:
        try:
            warehouse = Warehouse.query.filter_by(id=warehouse_id).first()
            return warehouse
        except Exception:
            raise WarehouseAccessDbException(warehouse_id=warehouse_id, method="getting")
        

    def select_per_page(self, page: int) -> list[Warehouse]:
        try:
            warehouse = Warehouse.query.paginate(page=page, per_page=10)
            if not warehouse:
                return None
            
            return {'max_pages' : warehouse.pages, 'warehouse': warehouse}
        except Exception:
            raise WarehouseAccessDbException(warehouse_id=None, method="getting")

    
    def select_all(self) -> list[Warehouse]:
        try:
            warehouses = Warehouse.query.all()
            if not warehouses:
                return None
            return warehouses
        except Exception:
            raise WarehouseAccessDbException(warehouse_id=None, method="getting")


    def insert(self, new_warehouse: Warehouse) -> None:
        try:
            with app.app_context():
                db.session.add(new_warehouse)
                db.session.commit()
                db.session.close()
        except Exception:
            raise WarehouseAccessDbException(warehouse_id=None, method="creating")
    

    def update(self, warehouse_id: int, update_warehouse: Warehouse) -> None:
        try:
            with app.app_context():
                warehouse = Warehouse.query.filter_by(id=warehouse_id).first()
                warehouse.name = update_warehouse.name
                warehouse.location_id = update_warehouse.location_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise WarehouseAccessDbException(warehouse_id=warehouse_id, method="updating")


    def delete(self, warehouse_id: int) -> None:
        try:
            with app.app_context():
                warehouse = Warehouse.query.filter_by(id=warehouse_id).first()
                db.session.delete(warehouse)
                db.session.commit()
                db.session.close()
        except Exception:
            raise WarehouseAccessDbException(warehouse_id=warehouse_id, method="deleting")