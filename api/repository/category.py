from model.category import Category
from database.db import db
from app import app
from exception.category import CategoryAccessDbException

class CategoryRepo():    

    def select_one_by_id(self, category_id: int) -> Category:
        try:
            category = Category.query.filter_by(id=category_id).first()
            return category
        except Exception:
            raise CategoryAccessDbException(category_id=category_id, method="getting")

    
    def select_all(self) -> list[Category]:
        try:
            categorys = Category.query.all()
            if not categorys:
                return None
            return categorys
        except Exception:
            raise CategoryAccessDbException(category_id=None, method="getting")


    def insert(self, new_category: Category) -> None:
        try:
            with app.app_context():
                db.session.add(new_category)
                db.session.commit()
                db.session.close()
        except Exception:
            raise CategoryAccessDbException(category_id=None, method="creating")
    

    def update(self, category_id: int, update_category: Category) -> None:
        try:
            with app.app_context():
                category = Category.query.filter_by(id=category_id).first()
                category.name = update_category.name
                category.description = update_category.description
                db.session.commit()
                db.session.close()
        except Exception:
            raise CategoryAccessDbException(category_id=category_id, method="updating")


    def delete(self, category_id: int) -> None:
        try:
            with app.app_context():
                category = Category.query.filter_by(id=category_id).first()
                db.session.delete(category)
                db.session.commit()
                db.session.close()
        except Exception:
            raise CategoryAccessDbException(category_id=category_id, method="deleting")