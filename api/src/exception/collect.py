class CollectIdNotFoundException(Exception):
    def __init__(self, collect_id: int) -> None:
        self.collect_id = collect_id

    def __str__(self) -> str:
        return f"Collect with id '{self.collect_id}' not found."
    

class CollectAccessDbException(Exception):
    def __init__(self, collect_id: int, method: str) -> None:
        self.collect_id = collect_id
        self.method = method

    def __str__(self) -> str:
        if self.collect_id:
            return f"Error {self.method} collect '{self.collect_id}'."
        else: 
            return f"Error {self.method} collects."
        

class CollectsDemandAlreadyExistsException(Exception):
    def __init__(self, collect_id: int, demand_id: int) -> None:
        self.collect_id = collect_id
        self.demand_id = demand_id
    def __str__(self) -> str:
        return f"Collect id '{self.collect_id}' already contains demand id '{self.demand_id}'."
    

class CollectsDemandNotFoundException(Exception):
    def __init__(self, collect_id: int, demand_id: int) -> None:
        self.collect_id = collect_id
        self.demand_id = demand_id

    def __str__(self) -> str:
        return f"Collect id '{self.collect_id}' don't contain demand id '{self.demand_id}'."
