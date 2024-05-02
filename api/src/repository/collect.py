from model.collect import Collect
from model.demand import Demand
from database.db import db
from app import app
from exception.collect import CollectAccessDbException


class CollectRepo():

    def select_one_by_id(self, collect_id: int) -> Collect:
        try:
            collect = Collect.query.filter_by(id=collect_id).first()
            return collect
        except Exception:
            raise CollectAccessDbException(collect_id=collect_id, method="getting")


    def select_per_page(self, page: int) -> list[Collect]:
        try:
            collects = Collect.query.paginate(page=page, per_page=9)
            if not collects:
                return None

            return {'max_pages': collects.pages, 'collects': collects}
        except Exception:
            raise CollectAccessDbException(collect_id=None, method="getting")
        

    def select_by_search(self, page: int, search: str) -> list[Collect]:
        try:
            collects = Collect.query.filter(Collect.name.like(f'%{search}%')).paginate(page=page, per_page=10)
            if not collects:
                return None
            
            return {'max_pages': collects.pages, 'collects': collects}
        except Exception:
            raise CollectAccessDbException(user_id=None, method="getting")
        

    def select_all(self) -> list[Collect]:
        try:
            collects = Collect.query.all()
            if not collects:
                return None
            return collects
        except Exception:
            raise CollectAccessDbException(collect_id=None, method="getting")


    def insert(self, new_collect: Collect, demands: list[int]) -> None:
        try:
            with app.app_context():
                db.session.add(new_collect)
                to_add_demands = Demand.query.filter(Demand.id.in_(demands)).all()
                for demand in to_add_demands:
                    new_collect.demands.append(demand)
                db.session.commit()
                db.session.close()
        except Exception:
            raise CollectAccessDbException(collect_id=None, method="creating")


    def update(self, collect_id: int, update_collect: Collect) -> None:
        try:
            with app.app_context():
                collect = Collect.query.filter_by(id=collect_id).first()
                collect.datetime = update_collect.datetime
                collect.roadmap = update_collect.roadmap
                collect.vehicle_id = update_collect.vehicle_id
                collect.storage_id = update_collect.storage_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise CollectAccessDbException(collect_id=collect_id, method="updating")


    def delete(self, collect_id: int) -> None:
        try:
            with app.app_context():
                collect = Collect.query.filter_by(id=collect_id).first()
                db.session.delete(collect)
                db.session.commit()
                db.session.close()
        except Exception:
            raise CollectAccessDbException(collect_id=collect_id, method="deleting")

