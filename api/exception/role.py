class RoleNameNotFoundException(Exception):
    def __init__(self, role_name: str) -> None:
        self.role_name = role_name

    def __str__(self) -> str:
        return f"Role name '{self.name}' not found."
    

class RoleIdNotFoundException(Exception):
    def __init__(self, role_id: int) -> None:
        self.role_id = role_id

    def __str__(self) -> str:
        return f"Role with id '{self.role_id}' not found."


class RoleAlreadyExistsException(Exception):
    def __init__(self, role_name: str) -> None:
        self.role_name = role_name

    def __str__(self) -> str:
        return f"Role with title '{self.role_name}' already exists."
    

class RoleAccessDbException(Exception):
    def __init__(self, role_id: int, method: str) -> None:
        self.role_id = role_id
        self.method = method

    def __str__(self) -> str:
        if self.role_id:
            return f"Error {self.method} role '{self.role_id}'."
        else: 
            return f"Error {self.method} roles."

    
