class UserEmailNotFoundException(Exception):
    def __init__(self, email: str) -> None:
        self.email = email

    def __str__(self) -> str:
        return f"User with email '{self.email}' not found."
    

class UserIdNotFoundException(Exception):
    def __init__(self, user_id: int) -> None:
        self.user_id = user_id

    def __str__(self) -> str:
        return f"User with id '{self.user_id}' not found."


class UserAlreadyExistsException(Exception):
    def __init__(self, email: str) -> None:
        self.email = email

    def __str__(self) -> str:
        return f"User with email '{self.email}' already exists."
    


class UserParticipatesEventAlreadyExistsException(Exception):
    def __init__(self, user_id: int, event_id: int) -> None:
        self.user_id = user_id
        self.event_id = event_id
    def __str__(self) -> str:
        return f"User id '{self.user_id}' participates event id '{self.event_id}' already exists."
    

class UserIsRoleAlreadyExistsException(Exception):
    def __init__(self, user_id: int, role_id: int) -> None:
        self.user_id = user_id
        self.role_id = role_id
    def __str__(self) -> str:
        return f"User id '{self.user_id}' is role id '{self.role_id}' already exists."
    
class UserRoleNotEmptyException(Exception):
    def __init__(self, user_id: int) -> None:
        self.user_id = user_id
    def __str__(self) -> str:
        return f"User id '{self.user_id}' must have role."



class UserParticipatesEventNotFoundException(Exception):
    def __init__(self, user_id: int, event_id: int) -> None:
        self.user_id = user_id
        self.event_id = event_id

    def __str__(self) -> str:
        return f"User id '{self.user_id}' participates event id '{self.event_id}' not found."


class UserIsRoleNotFoundException(Exception):
    def __init__(self, user_id: int, role_id: int) -> None:
        self.user_id = user_id
        self.role_id = role_id

    def __str__(self) -> str:
        return f"User id '{self.user_id}' is role id '{self.role_id}' not found."



class UserAccessDbException(Exception):
    def __init__(self, user_id: int, method: str) -> None:
        self.user_id = user_id
        self.method = method

    def __str__(self) -> str:
        if self.user_id:
            return f"Error {self.method} user '{self.user_id}'."
        else: 
            return f"Error {self.method} users."

    
