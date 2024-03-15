from model.type import Type
from database.db import db
from app import app
from exception.type import TypeAccessDbException

class TypeRepo():    

    def select_one_by_id(self, type_id: int) -> Type:
        try:
            type = Type.query.filter_by(id=type_id).first()
            return type
        except Exception:
            raise TypeAccessDbException(type_id=type_id, method="getting")

    
    def select_all(self) -> list[Type]:
        try:
            types = Type.query.all()
            if not types:
                return None
            return types
        except Exception:
            raise TypeAccessDbException(type_id=None, method="getting")


    def insert(self, new_type: Type) -> None:
        try:
            with app.app_context():
                db.session.add(new_type)
                db.session.commit()
                db.session.close()
        except Exception:
            raise TypeAccessDbException(type_id=None, method="creating")
    

    def update(self, type_id: int, update_type: Type) -> None:
        try:
            with app.app_context():
                type = Type.query.filter_by(id=type_id).first()
                type.name = update_type.name
                type.datetime = update_type.atetime
                db.session.commit()
                db.session.close()
        except Exception:
            raise TypeAccessDbException(type_id=type_id, method="updating")


    def delete(self, type_id: int) -> None:
        try:
            type = Type.query.filter_by(id=type_id).first()
            with app.app_context():
                db.session.delete(type)
                db.session.commit()
                db.session.close()
        except Exception:
            raise TypeAccessDbException(type_id=type_id, method="deleting")