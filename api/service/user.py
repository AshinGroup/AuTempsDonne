from model.user import User
from repository.user import UserRepo
from exception.user import UserEmailNotFoundException, UserIdNotFoundException, UserAlreadyExistsException, UserAccessDbException

class UserService:

    def __init__(self) -> None:
        self.user_repo = UserRepo()


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
        new_user = User(first_name=args['first_name'], last_name=args['last_name'], email=args['email'], phone=args['phone'], role=args['role'], password=args['password']) 
        if self.user_repo.select_one_by_email(email=new_user.email):
            raise UserAlreadyExistsException(new_user.email)
        else:
            self.user_repo.insert(new_user=new_user)
    

    def update(self, email: str, args: dict):
        update_user = User(first_name=args['first_name'], last_name=args['last_name'], email=args['email'], phone=args['phone'], role=args['role'], password=args['password']) 
        user = self.user_repo.select_one_by_email(email=email)
        
        if not user:
            raise UserEmailNotFoundException(email=email)
        
        users_with_email = self.user_repo.select_by_email(email=update_user.email)
        if len(users_with_email) > 1:
            raise UserAlreadyExistsException(email=email)
        
        self.user_repo.update(update_user=update_user)
        
    def delete(self, email: str):
        if not self.user_repo.select_one_by_email(email=email):
            raise UserEmailNotFoundException(email=email)
        self.user_repo.delete(email=email)
        
            
        

