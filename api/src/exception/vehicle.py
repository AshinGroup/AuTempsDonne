class VehicleIdNotFoundException(Exception):
    def __init__(self, vehicle_id: int) -> None:
        self.vehicle_id = vehicle_id

    def __str__(self) -> str:
        return f"Vehicle with id '{self.vehicle_id}' not found."
    

class VehicleAccessDbException(Exception):
    def __init__(self, vehicle_id: int, method: str) -> None:
        self.vehicle_id = vehicle_id
        self.method = method

    def __str__(self) -> str:
        if self.vehicle_id:
            return f"Error {self.method} vehicle '{self.vehicle_id}'."
        else: 
            return f"Error {self.method} vehicles."
