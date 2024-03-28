class WarehouseIdNotFoundException(Exception):
    def __init__(self, warehouse_id: int) -> None:
        self.warehouse_id = warehouse_id

    def __str__(self) -> str:
        return f"Warehouse with id '{self.warehouse_id}' not found."
    

class WarehouseIdGroupNotFoundException(Exception):
    def __init__(self, group: int) -> None:
        self.group = group

    def __str__(self) -> str:
        return f"Warehouse group with id '{self.group}' not found."
    


class WarehouseAccessDbException(Exception):
    def __init__(self, warehouse_id: int, method: str) -> None:
        self.warehouse_id = warehouse_id
        self.method = method

    def __str__(self) -> str:
        if self.warehouse_id:
            return f"Error {self.method} warehouse '{self.warehouse_id}'."
        else: 
            return f"Error {self.method} warehouses."
