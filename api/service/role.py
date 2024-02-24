from model.role import Role
from repository.role import RoleRepo
from exception.role import RoleIdNotFoundException

class RoleService:

    def __init__(self) -> None:
        self.role_repo = RoleRepo()


    def select_one_by_id(self, role_id: int):
        role = self.role_repo.select_one_by_id(role_id=role_id)
        if role:
            return role
        else:
            raise RoleIdNotFoundException(role_id=role_id)
        

    def select_all(self):
        roles = self.role_repo.select_all()
        return roles


    def insert(self, args: dict):
        new_role = Role(role_name=args['role_name'])
        self.role_repo.insert(new_role=new_role)
    

    def update(self, role_id: int, args: dict):
        update_role = Role(role_name=args['role_name'])
        role = self.role_repo.select_one_by_id(role_id=role_id)
        
        if not role:
            raise RoleIdNotFoundException(role_id=role_id)
        
        self.role_repo.update(role_id=role.role_id, update_role=update_role)
        
        
    def delete(self, role_id: str):
        if not self.role_repo.select_one_by_id(role_id=role_id):
            raise RoleIdNotFoundException(role_id=role_id)
        self.role_repo.delete(role_id=role_id)
