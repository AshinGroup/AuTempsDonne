class DeliveryIdNotFoundException(Exception):
    def __init__(self, delivery_id: int) -> None:
        self.delivery_id = delivery_id

    def __str__(self) -> str:
        return f"Delivery with id '{self.delivery_id}' not found."
    

class DeliveryAccessDbException(Exception):
    def __init__(self, delivery_id: int, method: str) -> None:
        self.delivery_id = delivery_id
        self.method = method

    def __str__(self) -> str:
        if self.delivery_id:
            return f"Error {self.method} delivery '{self.delivery_id}'."
        else: 
            return f"Error {self.method} deliveries."


class DeliversToLocationEventAlreadyExistsException(Exception):
    def __init__(self, delivery_id: int, location_id: int) -> None:
        self.delivery_id = delivery_id
        self.location_id = location_id
    def __str__(self) -> str:
        return f"Delivery id '{self.delivery_id}' already contains location id '{self.location_id}'."
    

class DeliversToLocationNotFoundException(Exception):
    def __init__(self, delivery_id: int, location_id: int) -> None:
        self.delivery_id = delivery_id
        self.location_id = location_id

    def __str__(self) -> str:
        return f"Delivery id '{self.delivery_id}' don't contains location id '{self.location_id}'."