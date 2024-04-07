class CategoryIdNotFoundException(Exception):
    def __init__(self, category_id: int) -> None:
        self.category_id = category_id

    def __str__(self) -> str:
        return f"Category with id '{self.category_id}' not found."
    

class CategoryAccessDbException(Exception):
    def __init__(self, category_id: int, method: str) -> None:
        self.category_id = category_id
        self.method = method

    def __str__(self) -> str:
        if self.category_id:
            return f"Error {self.method} category '{self.category_id}'."
        else: 
            return f"Error {self.method} categorys."
