from model.food import Food
from repository.food import FoodRepo
from exception.food import FoodIdNotFoundException, FoodIdGroupNotFoundException
from exception.category import CategoryIdNotFoundException
from service.category import CategoryService


class FoodService:

    def __init__(self) -> None:
        self.food_repo = FoodRepo()
        self.category_service = CategoryService()

    def select_one_by_id(self, food_id: int):
        food = self.food_repo.select_one_by_id(food_id=food_id)
        if food:
            return food
        else:
            raise FoodIdNotFoundException(food_id=food_id)
        
    def select_per_page(self, page: int) -> list[Food]:
        foods = self.food_repo.select_per_page(page=page)
        return foods


    def select_all(self):
        foods = self.food_repo.select_all()
        return foods

    def insert(self, args: dict):
        new_food = Food(name=args['name'], description=args['description'], category_id=args['category_id'])

        if not self.category_service.select_one_by_id(new_food.category_id):
            raise CategoryIdNotFoundException
        self.category_service.select_one_by_id(category_id=new_food.category_id)
        self.food_repo.insert(new_food=new_food)

    def update(self, food_id: int, args: dict):
        update_food = Food(name=args['name'], description=args['description'], category_id=args['category_id'])
        food = self.food_repo.select_one_by_id(food_id=food_id)

        if not food:
            raise FoodIdNotFoundException(food_id=food_id)

        if not self.category_service.select_one_by_id(update_food.category_id):
            raise CategoryIdNotFoundException

        self.category_service.select_one_by_id(category_id=update_food.category_id)

        self.food_repo.update(food_id=food_id, update_food=update_food)

    def delete(self, food_id: str):
        if not self.food_repo.select_one_by_id(food_id=food_id):
            raise FoodIdNotFoundException(food_id=food_id)
        self.food_repo.delete(food_id=food_id)
