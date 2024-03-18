class LocationIdNotFoundException(Exception):
    def __init__(self, location_id: int) -> None:
        self.location_id = location_id

    def __str__(self) -> str:
        return f"Location with id '{self.location_id}' not found."
    

class LocationAccessDbException(Exception):
    def __init__(self, location_id: int, method: str) -> None:
        self.location_id = location_id
        self.method = method

    def __str__(self) -> str:
        if self.location_id:
            return f"Error {self.method} location '{self.location_id}'."
        else: 
            return f"Error {self.method} locations."

