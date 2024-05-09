class TicketIdNotFoundException(Exception):
    def __init__(self, ticket_id: int) -> None:
        self.ticket_id = ticket_id

    def __str__(self) -> str:
        return f"Ticket with id '{self.ticket_id}' not found."
    


class TicketAccessDbException(Exception):
    def __init__(self, ticket_id: int, method: str) -> None:
        self.ticket_id = ticket_id
        self.method = method

    def __str__(self) -> str:
        if self.ticket_id:
            return f"Error {self.method} ticket '{self.ticket_id}'."
        else: 
            return f"Error {self.method} tickets."
