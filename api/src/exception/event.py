class EventIdNotFoundException(Exception):
    def __init__(self, event_id: int) -> None:
        self.event_id = event_id

    def __str__(self) -> str:
        return f"Event with id '{self.event_id}' not found."
    

class EventIdGroupNotFoundException(Exception):
    def __init__(self, group: int) -> None:
        self.group = group

    def __str__(self) -> str:
        return f"Event group with id '{self.group}' not found."
    


class EventAccessDbException(Exception):
    def __init__(self, event_id: int, method: str) -> None:
        self.event_id = event_id
        self.method = method

    def __str__(self) -> str:
        if self.event_id:
            return f"Error {self.method} event '{self.event_id}'."
        else: 
            return f"Error {self.method} events."
