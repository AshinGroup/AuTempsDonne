from model.event import Event
from repository.event import EventRepo
from exception.event import EventIdNotFoundException, EventIdGroupNotFoundException
from exception.type import TypeIdNotFoundException
from service.type import TypeService


class EventService:

    def __init__(self) -> None:
        self.event_repo = EventRepo()
        self.type_service = TypeService()

    def select_one_by_id(self, event_id: int):
        event = self.event_repo.select_one_by_id(event_id=event_id)
        if event:
            return event
        else:
            raise EventIdNotFoundException(event_id=event_id)

    def select_all(self):
        events = self.event_repo.select_all()
        return events

    def insert(self, args: dict):
        new_event = Event(name=args['name'], datetime=args['datetime'], description=args['description'],
                          capacity=args['capacity'], group=args['group'], type_id=args['type_id'], place=args['place'])
        if new_event.group < 1 or new_event.group > 3:
            raise EventIdGroupNotFoundException
        if not self.type_service.select_one_by_id(new_event.type_id):
            raise TypeIdNotFoundException
        self.type_service.select_one_by_id(type_id=new_event.type_id)
        self.event_repo.insert(new_event=new_event)

    def update(self, event_id: int, args: dict):
        update_event = Event(name=args['name'], datetime=args['datetime'], description=args['description'],
                             capacity=args['capacity'], group=args['group'], type_id=args['type_id'], place=args['place'])
        event = self.event_repo.select_one_by_id(event_id=event_id)

        if update_event.group < 1 or update_event.group > 3:
            raise EventIdGroupNotFoundException

        if not event:
            raise EventIdNotFoundException(event_id=event_id)

        if not self.type_service.select_one_by_id(update_event.type_id):
            raise TypeIdNotFoundException

        self.type_service.select_one_by_id(type_id=update_event.type_id)

        self.event_repo.update(event_id=event_id, update_event=update_event)

    def delete(self, event_id: str):
        if not self.event_repo.select_one_by_id(event_id=event_id):
            raise EventIdNotFoundException(event_id=event_id)
        self.event_repo.delete(event_id=event_id)
