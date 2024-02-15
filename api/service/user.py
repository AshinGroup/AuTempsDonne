from model.user import User
from repository.user import UserRepo

class UserService:
    def __init__(self) -> None:
        self.user_repo = UserRepo()

    def insert(self, args: dict):
        new_user = User(first_name=args['first_name'], last_name=args['last_name'], mail=args['mail'], phone=args['phone'], role=args['role'], password=args['password']) 
        self.user_repo.insert(new_user)
    
