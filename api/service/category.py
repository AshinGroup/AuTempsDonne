from model.category import Category
from repository.category import CategoryRepo
from exception.category import CategoryIdNotFoundException

class CategoryService:

    def __init__(self) -> None:
        self.category_repo = CategoryRepo()


    def select_one_by_id(self, category_id: int):
        category = self.category_repo.select_one_by_id(category_id=category_id)
        if category:
            return category
        else:
            raise CategoryIdNotFoundException(category_id=category_id)
        

    def select_all(self):
        events = self.category_repo.select_all()
        return events


    def insert(self, args: dict):
        new_category = Category(name=args['name'], description=args['description'])
        self.category_repo.insert(new_category=new_category)
    

    def update(self, category_id: int, args: dict):
        update_category = Category(name=args['name'], description=args['description'])
        category = self.category_repo.select_one_by_id(category_id=category_id)
        
        if not category:
            raise CategoryIdNotFoundException(category_id=category_id)
        
        self.category_repo.update(category_id=category_id, update_category=update_category)
        
        
    def delete(self, category_id: str):
        if not self.category_repo.select_one_by_id(category_id=category_id):
            raise CategoryIdNotFoundException(category_id=category_id)
        self.category_repo.delete(category_id=category_id)
