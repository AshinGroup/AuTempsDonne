class LoginException(Exception):  
    def __str__(self) -> str:
        return f"The password does not match email address."

class TokenException(Exception):
    def __str__(self) -> str:
        return f"Error while creating the token."