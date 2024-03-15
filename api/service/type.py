from model.type import Type
from repository.type import TypeRepo
from exception.type import TypeIdNotFoundException

class TypeService:

    def __init__(self) -> None:
        self.type_repo = TypeRepo()


    def select_one_by_id(self, type_id: int):
        type = self.type_repo.select_one_by_id(type_id=type_id)
        if type:
            return type
        else:
            raise TypeIdNotFoundException(type_id=type_id)
        

    def select_all(self):
        activities = self.type_repo.select_all()
        return activities


    def insert(self, args: dict):
        new_type = Type(name=args['name'])
        self.type_repo.insert(new_type=new_type)
    

    def update(self, type_id: int, args: dict):
        update_type = Type(name=args['name'])
        type = self.type_repo.select_one_by_id(type_id=type_id)
        
        if not type:
            raise TypeIdNotFoundException(type_id=type_id)
        
        self.type_repo.update(type_id=type.type_id, update_type=update_type)
        
        
    def delete(self, type_id: str):
        if not self.type_repo.select_one_by_id(type_id=type_id):
            raise TypeIdNotFoundException(type_id=type_id)
        self.type_repo.delete(type_id=type_id)
