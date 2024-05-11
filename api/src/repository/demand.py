from model.demand import Demand
from database.db import db
from app import app
from exception.demand import DemandAccessDbException


class DemandRepo():

    def select_one_by_id(self, demand_id: int) -> Demand:
        try:
            demand = Demand.query.filter_by(id=demand_id).first()
            return demand
        except Exception:
            raise DemandAccessDbException(demand_id=demand_id, method="getting")


    def select_per_page(self, page: int) -> list[Demand]:
        try:
            demands = Demand.query.paginate(page=page, per_page=9)
            if not demands:
                return None

            return {'max_pages': demands.pages, 'demands': demands}
        except Exception:
            raise DemandAccessDbException(demand_id=None, method="getting")
        

    def select_by_search(self, page: int, search: str) -> list[Demand]:
        try:
            demands = Demand.query.filter(Demand.name.like(f'%{search}%')).paginate(page=page, per_page=10)
            if not demands:
                return None
            
            return {'max_pages': demands.pages, 'demands': demands}
        except Exception:
            raise DemandAccessDbException(user_id=None, method="getting")
        

    def select_all(self) -> list[Demand]:
        try:
            demands = Demand.query.all()
            if not demands:
                return None
            return demands
        except Exception:
            raise DemandAccessDbException(demand_id=None, method="getting")


    def insert(self, new_demand: Demand) -> None:
        try:
            with app.app_context():
                db.session.add(new_demand)
                db.session.flush()
                new_demand_id = new_demand.id
                db.session.commit()
                db.session.close()
                return new_demand_id
        except Exception:
            raise DemandAccessDbException(demand_id=None, method="creating")


    def update(self, demand_id: int, update_demand: Demand) -> None:
        try:
            with app.app_context():
                demand = Demand.query.filter_by(id=demand_id).first()
                demand.submitted_datetime = update_demand.submitted_datetime
                demand.limit_datetime = update_demand.limit_datetime
                demand.status = update_demand.status
                demand.additional = update_demand.additional
                demand.shop_id = update_demand.shop_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise DemandAccessDbException(demand_id=demand_id, method="updating")

    def update_qr_code(self, demand_id: int, png_src: str, pdf_src: str) -> None:
        try:
            with app.app_context():
                demand = Demand.query.filter_by(id=demand_id).first()
                demand.png_src = update_demand.png_src
                demand.pdf_src = update_demand.pdf_src
                db.session.commit()
                db.session.close()
        except Exception:
            raise DemandAccessDbException(demand_id=demand_id, method="updating")
    

    def delete(self, demand_id: int) -> None:
        try:
            with app.app_context():
                demand = Demand.query.filter_by(id=demand_id).first()
                db.session.delete(demand)
                db.session.commit()
                db.session.close()
        except Exception:
            raise DemandAccessDbException(demand_id=demand_id, method="deleting")
