class ActivityIdNotFoundException(Exception):
    def __init__(self, activity_id: int) -> None:
        self.activity_id = activity_id

    def __str__(self) -> str:
        return f"Activity with id '{self.activity_id}' not found."
    

class ActivityAccessDbException(Exception):
    def __init__(self, activity_id: int, method: str) -> None:
        self.activity_id = activity_id
        self.method = method

    def __str__(self) -> str:
        if self.activity_id:
            return f"Error {self.method} activity '{self.activity_id}'."
        else: 
            return f"Error {self.method} activities."
