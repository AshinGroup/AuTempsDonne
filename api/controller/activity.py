from flask_restful import Resource, reqparse, inputs, abort
from service.activity import ActivityService
from exception.activity import *
from exception.type import *
from flask import jsonify

class ActivityCheckArgs:

    pattern = {'datetime': r'\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\b',
               'description': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,500}\b'}  # format : YYYY-MM-DD.
        
    
    def get_activity_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help="Invalid or missing parameter 'name'.")
        parser.add_argument('datetime', type=inputs.regex(self.pattern['datetime']), required=True, help="Invalid or missing parameter 'datetime'.")
        parser.add_argument('description', type=inputs.regex(self.pattern['description']), required=True, help="Invalid or missing parameter 'description'.")
        parser.add_argument('capacity', type=int, required=True, help="Invalid or missing parameter 'capactity'.")
        parser.add_argument('type_id', type=int, required=True, help="Invalid or missing parameter 'type_id'.")
        
        args = parser.parse_args(strict=True)
        return args


class ActivityController(Resource):

    def __init__(self) -> None:
        self.check_args = ActivityCheckArgs()
        self.activity_service = ActivityService()


    def get(self, activity_id: int):
        try:
            activity = self.activity_service.select_one_by_id(activity_id=activity_id)
            return jsonify(activity.json())
        except ActivityIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, activity_id: int):
        try:
            args = self.check_args.get_activity_args()
            self.activity_service.update(activity_id=activity_id, args=args)
            return jsonify({'message': f"Activity '{activity_id}' successfully updated."})
        except ActivityIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, activity_id: int):
        try:
            self.activity_service.delete(activity_id=activity_id)
            return jsonify({'message': f"Activity '{activity_id}' successfully deleted."})
        except ActivityIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class ActivityListController(Resource):
    def __init__(self) -> None:
        self.check_args = ActivityCheckArgs()
        self.activity_service = ActivityService()
    

    def get(self):
        try:
            activities = self.activity_service.select_all()
            if activities:
                return jsonify([activity.json() for activity in activities])
            else:
                return jsonify({'message': "None activities."})
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_activity_args()
            self.activity_service.insert(args=args)
            return jsonify({'message': f"Activity '{args['name']}' successfully created."})
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
