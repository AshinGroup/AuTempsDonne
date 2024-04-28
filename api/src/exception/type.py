class TypeIdNotFoundException(Exception):
    def __init__(self, type_id: int) -> None:
        self.type_id = type_id

    def __str__(self) -> str:
        return f"Type with id '{self.type_id}' not found."
    

class TypeAccessDbException(Exception):
    def __init__(self, type_id: int, method: str) -> None:
        self.type_id = type_id
        self.method = method

    def __str__(self) -> str:
        if self.type_id:
            return f"Error {self.method} type '{self.type_id}'."
        else: 
            return f"Error {self.method} types."
