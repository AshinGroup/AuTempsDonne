class DemandIdNotFoundException(Exception):
    def __init__(self, demand_id: int) -> None:
        self.demand_id = demand_id

    def __str__(self) -> str:
        return f"Demand with id '{self.demand_id}' not found."
    


class CollectsDemandAlreadyExistsException(Exception):
    def __init__(self, demand_id: int) -> None:
        self.demand_id = demand_id

    def __str__(self) -> str:
        return f"Demand with id '{self.demand_id}' already have a collect id."
    
    


class DemandAccessDbException(Exception):
    def __init__(self, demand_id: int, method: str) -> None:
        self.demand_id = demand_id
        self.method = method

    def __str__(self) -> str:
        if self.demand_id:
            return f"Error {self.method} demand '{self.demand_id}'."
        else: 
            return f"Error {self.method} demands."
