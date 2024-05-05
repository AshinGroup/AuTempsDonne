from model.ticket import Ticket
from database.db import db
from app import app
from exception.ticket import TicketAccessDbException


class TicketRepo():

    def select_one_by_id(self, ticket_id: int) -> Ticket:
        try:
            ticket = Ticket.query.filter_by(id=ticket_id).first()
            return ticket
        except Exception:
            raise TicketAccessDbException(ticket_id=ticket_id, method="getting")


    def select_all_by_user_id(self, user_id: int) -> Ticket:
        try:
            tickets = Ticket.query.filter(Ticket.author_id.like(user_id) | Ticket.admin_id.like(user_id)).all()
            if not tickets:
                return None
            
            return {'tickets': tickets}
        except Exception:
            raise TicketAccessDbException(user_id=None, method="getting")
        


    def select_per_page(self, page: int) -> list[Ticket]:
        try:
            tickets = Ticket.query.paginate(page=page, per_page=9)
            if not tickets:
                return None

            return {'max_pages': tickets.pages, 'tickets': tickets}
        except Exception:
            raise TicketAccessDbException(ticket_id=None, method="getting")
        

    def select_by_search(self, page: int, search: str) -> list[Ticket]:
        try:
            tickets = Ticket.query.filter(Ticket.subject.like(f'%{search}%')).paginate(page=page, per_page=10)
            if not tickets:
                return None
            
            return {'max_pages': tickets.pages, 'tickets': tickets}
        except Exception:
            raise TicketAccessDbException(user_id=None, method="getting")
        

    def select_all(self) -> list[Ticket]:
        try:
            tickets = Ticket.query.all()
            if not tickets:
                return None
            return tickets
        except Exception:
            raise TicketAccessDbException(ticket_id=None, method="getting")


    def insert(self, new_ticket: Ticket) -> None:
        try:
            with app.app_context():
                db.session.add(new_ticket)
                db.session.commit()
                db.session.close()
        except Exception:
            raise TicketAccessDbException(ticket_id=None, method="creating")


    def update(self, ticket_id: int, update_ticket: Ticket) -> None:
        try:
            with app.app_context():
                ticket = Ticket.query.filter_by(id=ticket_id).first()
                ticket.status = update_ticket.status
                ticket.admin_id = update_ticket.admin_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise TicketAccessDbException(ticket_id=ticket_id, method="updating")


    def delete(self, ticket_id: int) -> None:
        try:
            with app.app_context():
                ticket = Ticket.query.filter_by(id=ticket_id).first()
                db.session.delete(ticket)
                db.session.commit()
                db.session.close()
        except Exception:
            raise TicketAccessDbException(ticket_id=ticket_id, method="deleting")
