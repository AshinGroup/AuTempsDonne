class FoodIdNotFoundException(Exception):
    def __init__(self, food_id: int) -> None:
        self.food_id = food_id

    def __str__(self) -> str:
        return f"Food with id '{self.food_id}' not found."
    

class FoodAccessDbException(Exception):
    def __init__(self, food_id: int, method: str) -> None:
        self.food_id = food_id
        self.method = method

    def __str__(self) -> str:
        if self.food_id:
            return f"Error {self.method} food '{self.food_id}'."
        else: 
            return f"Error {self.method} foods."
