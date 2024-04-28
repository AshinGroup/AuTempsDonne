class RoadmapIdNotFoundException(Exception):
    def __init__(self, delivery_id: int) -> None:
        self.delivery_id = delivery_id

    def __str__(self) -> str:
        return f"Delivery with id '{self.delivery_id}' not found."