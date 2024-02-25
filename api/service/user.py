from model.user import User
from repository.user import UserRepo
from exception.user import UserEmailNotFoundException, UserIdNotFoundException, UserAlreadyExistsException
from exception.role import RoleIdNotFoundException
from service.role import RoleService

class UserService:

    def __init__(self) -> None:
        self.user_repo = UserRepo()
        self.role_service = RoleService()


    def select_one_by_id(self, user_id: int):
        user = self.user_repo.select_one_by_id(user_id=user_id)
        if user:
            return user
        else:
            raise UserIdNotFoundException(user_id=user_id)


    def select_one_by_email(self, email: str):
        user = self.user_repo.select_one_by_email(email=email)
        if user:
            return user
        else:
            raise UserEmailNotFoundException(email=email)
        

    def select_all(self):
        users = self.user_repo.select_all()
        return users


    def insert(self, args: dict):
        new_user = User(first_name=args['first_name'], last_name=args['last_name'], email=args['email'], phone=args['phone'], password=args['password']) 
        if self.user_repo.select_one_by_email(email=new_user.email):
            raise UserAlreadyExistsException(new_user.email)
        if not self.role_service.select_one_by_id(args['role_id']):
            raise RoleIdNotFoundException

        self.user_repo.insert(new_user=new_user, role_id=args['role_id'])
    

    def update(self, user_id: int, args: dict):
        update_user = User(first_name=args['first_name'], last_name=args['last_name'], email=args['email'], phone=args['phone'], password=args['password']) 
        user = self.user_repo.select_one_by_id(user_id=user_id)
        
        if not user:
            raise UserIdNotFoundException(user_id=user_id)
        
        users_with_email = self.user_repo.select_by_email(email=update_user.email)
       
        if len(users_with_email) == 2 or users_with_email[0].user_id != user_id:
           raise UserAlreadyExistsException(email=update_user.email)
        
        self.user_repo.update(user_id=user.user_id, update_user=update_user)
        
        
    def delete(self, user_id: str):
        if not self.user_repo.select_one_by_id(user_id=user_id):
            raise UserIdNotFoundException(user_id=user_id)
        self.user_repo.delete(user_id=user_id)
        
            
        

