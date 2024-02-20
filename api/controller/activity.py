from flask_restful import Resource, reqparse, inputs, abort
from service.activity import ActivityService
from exception.activity import ActivityIdNotFoundException, ActivityAccessDbException
from flask import jsonify

class ActivityCheckArgs:
    
    types = [''] # Qu'elles sont les différents type d'activité ??

    pattern = {'date': r'\b\d{4}-\d{2}-\d{2}\b',  # format : YYYY-MM-DD.
                'location': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,100}\b' # lettres, chiffres, espaces et caractères spéciaux courants, jusqu'à 100 caractères.
                }
    
    def get_user_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=str, required=True, help="Invalid or missing parameter type")
        parser.add_argument('date', type=inputs.regex(self.pattern['date']), required=True, help="Invalid or missing parameter date")
        parser.add_argument('activity_location', type=inputs.regex(self.pattern['activity_location']), required=True, help="Invalid or missing parameter activity location")
        args = parser.parse_args(strict=True)
        if not args['type'] in self.types:
            abort(400, message=f"Invalide parameter type : \'{args['type']}\' doesn\'t exist.")
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
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, activity_id: int):
        try:
            args = self.check_args.get_activity_args()
            self.activity_service.update(activity_id=activity_id, args=args)
            return f"Activity '{activity_id}' successfully updated."
        except ActivityIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, activity_id: int):
        try:
            self.activity_service.delete(activity_id=activity_id)
            return f"Activity '{activity_id}' successfully deleted."
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
            return jsonify([activity.json() for activity in activities])
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_activity_args()
            self.activity_service.insert(args=args)
            return f"Activity '{args['id']}' successfully created."
        except ActivityAccessDbException as e:
            abort(http_status_code=500, message=str(e))
