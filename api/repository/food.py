from model.food import Food
from database.db import db
from app import app
from exception.food import FoodAccessDbException

class FoodRepo():    

    def select_one_by_id(self, food_id: int) -> Food:
        try:
            food = Food.query.filter_by(id=food_id).first()
            return food
        except Exception:
            raise FoodAccessDbException(food_id=food_id, method="getting")
        

    def select_per_page(self, page: int) -> list[Food]:
        try:
            food = Food.query.paginate(page=page, per_page=10)
            if not food:
                return None
            
            return {'max_pages' : food.pages, 'food': food}
        except Exception:
            raise FoodAccessDbException(food_id=None, method="getting")

    
    def select_all(self) -> list[Food]:
        try:
            foods = Food.query.all()
            if not foods:
                return None
            return foods
        except Exception:
            raise FoodAccessDbException(food_id=None, method="getting")


    def insert(self, new_food: Food) -> None:
        try:
            with app.app_context():
                db.session.add(new_food)
                db.session.commit()
                db.session.close()
        except Exception:
            raise FoodAccessDbException(food_id=None, method="creating")
    

    def update(self, food_id: int, update_food: Food) -> None:
        try:
            with app.app_context():
                food = Food.query.filter_by(id=food_id).first()
                food.name = update_food.name
                food.description = update_food.description
                food.category_id = update_food.category_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise FoodAccessDbException(food_id=food_id, method="updating")


    def delete(self, food_id: int) -> None:
        try:
            with app.app_context():
                food = Food.query.filter_by(id=food_id).first()
                db.session.delete(food)
                db.session.commit()
                db.session.close()
        except Exception:
            raise FoodAccessDbException(food_id=food_id, method="deleting")