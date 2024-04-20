from flask_restful import Resource, reqparse, inputs, abort
from service.event import EventService
from exception.event import *
from exception.type import *
from flask import jsonify

class EventCheckArgs:

    pattern = {'datetime': r'\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\b',
               'description': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,500}\b'}  # format : YYYY-MM-DD.
        
    
    def get_event_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help="Invalid or missing parameter 'name'.")
        parser.add_argument('datetime', type=inputs.regex(self.pattern['datetime']), required=True, help="Invalid or missing parameter 'datetime'.")
        parser.add_argument('description', type=inputs.regex(self.pattern['description']), required=True, help="Invalid or missing parameter 'description'.")
        parser.add_argument('capacity', type=int, required=True, help="Invalid or missing parameter 'capactity'.")
        parser.add_argument('type_id', type=int, required=True, help="Invalid or missing parameter 'type_id'.")
        parser.add_argument('group', type=int, required=True, help="Invalid or missing parameter 'group'.")
        parser.add_argument('place', type=str, required=True, help="Invalid or missing parameter 'place'.")
        args = parser.parse_args(strict=True)
        return args


class EventController(Resource):

    def __init__(self) -> None:
        self.check_args = EventCheckArgs()
        self.event_service = EventService()


    def get(self, event_id: int):
        try:
            event = self.event_service.select_one_by_id(event_id=event_id)
            return jsonify(event.json())
        except EventIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except EventAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, event_id: int):
        try:
            args = self.check_args.get_event_args()
            self.event_service.update(event_id=event_id, args=args)
            return jsonify({'message': f"Event '{event_id}' successfully updated."})
        except EventIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except EventIdGroupNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except EventAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, event_id: int):
        try:
            self.event_service.delete(event_id=event_id)
            return jsonify({'message': f"Event '{event_id}' successfully deleted."})
        except EventIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except EventAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class EventListController(Resource):
    def __init__(self) -> None:
        self.check_args = EventCheckArgs()
        self.event_service = EventService()
    

    def get(self):
        try:
            events = self.event_service.select_all()
            if events:
                return jsonify([event.json() for event in events])
            else:
                return jsonify({'message': "No events found."})
        except EventAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_event_args()
            self.event_service.insert(args=args)
            return jsonify({'message': f"Event '{args['name']}' successfully created."})
        except EventAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except EventIdGroupNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class EventPageController(Resource):
    def __init__(self) -> None:
        self.event_service = EventService()
    

    def get(self, page: int):
        try:
            events = self.event_service.select_per_page(page=page)
            if events:
                return jsonify({'max_pages': events['max_pages'], 'events': [event.json() for event in events['events']]})
            else:
                return jsonify({'message': "No events found."})
        except EventAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

class EventSearchController(Resource):
    def __init__(self) -> None:
        self.event_service = EventService()

    def get(self, page: int, search: str):
        try:
            events = self.event_service.select_by_search(page=page, search=search)
            if events:
                return jsonify({'max_pages': events['max_pages'], 'events': [event.json() for event in events['events']]})
            else:
                return jsonify({'message': "No events found."})
        except EventAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        