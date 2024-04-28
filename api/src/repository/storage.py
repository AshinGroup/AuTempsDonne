from model.storage import Storage
from database.db import db
from app import app
from exception.storage import StorageAccessDbException

class StorageRepo():    

    def select_one_by_id(self, storage_id: int) -> Storage:
        try:
            storage = Storage.query.filter_by(id=storage_id).first()
            return storage
        except Exception:
            raise StorageAccessDbException(storage_id=storage_id, method="getting")
        

    def select_per_page(self, page: int) -> list[Storage]:
        try:
            storage = Storage.query.paginate(page=page, per_page=10)
            if not storage:
                return None
            
            return {'max_pages' : storage.pages, 'storage': storage}
        except Exception:
            raise StorageAccessDbException(storage_id=None, method="getting")

    
    def select_all(self) -> list[Storage]:
        try:
            storages = Storage.query.all()
            if not storages:
                return None
            return storages
        except Exception:
            raise StorageAccessDbException(storage_id=None, method="getting")


    def insert(self, new_storage: Storage) -> None:
        try:
            with app.app_context():
                db.session.add(new_storage)
                db.session.commit()
                db.session.close()
        except Exception:
            raise StorageAccessDbException(storage_id=None, method="creating")
    

    def update(self, storage_id: int, update_storage: Storage) -> None:
        try:
            with app.app_context():
                storage = Storage.query.filter_by(id=storage_id).first()
                storage.name = update_storage.name
                storage.warehouse_id = update_storage.warehouse_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise StorageAccessDbException(storage_id=storage_id, method="updating")


    def delete(self, storage_id: int) -> None:
        try:
            with app.app_context():
                storage = Storage.query.filter_by(id=storage_id).first()
                db.session.delete(storage)
                db.session.commit()
                db.session.close()
        except Exception:
            raise StorageAccessDbException(storage_id=storage_id, method="deleting")