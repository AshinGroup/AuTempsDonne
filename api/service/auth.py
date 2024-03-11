from service.user import UserService
from function.hash import verify_hash
from exception.auth import LoginException

class AuthService:
    def __init__(self) -> None:
        self.user_service = UserService()


    def login(self, email: str, password: str):
        user = self.user_service.select_one_by_email(email=email)
        if not verify_hash(password=password, hashed=user.password):
            raise LoginException
        return user

