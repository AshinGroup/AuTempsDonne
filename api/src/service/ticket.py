from model.ticket import Ticket
from repository.ticket import TicketRepo
from exception.ticket import TicketIdNotFoundException
from service.user import UserService


class TicketService:

    def __init__(self) -> None:
        self.ticket_repo = TicketRepo()
        self.user_service = UserService()

    def select_one_by_id(self, ticket_id: int):
        ticket = self.ticket_repo.select_one_by_id(ticket_id=ticket_id)
        if ticket:
            return ticket
        else:
            raise TicketIdNotFoundException(ticket_id=ticket_id)

    def select_per_page(self, page: int) -> list[Ticket]:
        tickets = self.ticket_repo.select_per_page(page=page)
        return tickets

    def select_by_search(self, page: int, search: str) -> list[Ticket]:
        tickets = self.ticket_repo.select_by_search(page=page, search=search)
        return tickets

    def select_all(self):
        tickets = self.ticket_repo.select_all()
        return tickets

    def select_all_by_user_id(self, user_id: int):
        tickets = self.ticket_repo.select_all_by_user_id(user_id=user_id)
        return tickets

    def insert(self, args: dict):
        new_ticket = Ticket(subject=args['subject'], description=args['description'],
                            type=args['type'], author_id=args['author_id'], status=0)
        self.user_service.select_one_by_id(user_id=new_ticket.author_id)
        self.ticket_repo.insert(new_ticket=new_ticket)

    def update(self, ticket_id: int, args: dict):

        update_ticket = Ticket(
            status=args['status'], admin_id=args['admin_id'])
        if update_ticket.admin_id:
            self.user_service.select_one_by_id(user_id=update_ticket.admin_id)

        ticket = self.ticket_repo.select_one_by_id(ticket_id=ticket_id)

        if not ticket:
            raise TicketIdNotFoundException(ticket_id=ticket_id)

        self.ticket_repo.update(ticket_id=ticket_id,
                                update_ticket=update_ticket)

    def delete(self, ticket_id: str):
        if not self.ticket_repo.select_one_by_id(ticket_id=ticket_id):
            raise TicketIdNotFoundException(ticket_id=ticket_id)
        self.ticket_repo.delete(ticket_id=ticket_id)
