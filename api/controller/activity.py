from flask_restful import Resource, reqparse, inputs, abort
from service.activity import ActivityService
from exception.activity import ActivityIdNotFoundException, ActivityAccessDbException
from flask import jsonify

# Voir qu'elles sont les vérifications à faire pour le type, la date et le lieu ?
"""
class ActivityCheckArgs:
    pattern = {'name' : r'\b[A-Za-zÀ-ÖØ-öø-ÿ\-]{1,30}\b', # Validates names with letters and hyphens, 1 to 30 characters.
                'phone' : r'\b(?:\+?\d{1,3}[-.●]?)?(?:\(\d{1,4}\)[-.\●]?)?\d{6,}\b', #Validates phone numbers with optional international and regional codes, at least six digits.
                'email' : '([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+', # Validates standard email addresses.
                'password': r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>/?]).{8,}$'}
    
    roles = ['volunteer', 'beneficiary', 'admin']
    
    def get_user_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('first_name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter first name")
        parser.add_argument('last_name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter last name")
        parser.add_argument('email', type=inputs.regex(self.pattern['email']), required=True, help="Invalid or missing parameter email")
        parser.add_argument('phone', type=inputs.regex(self.pattern['phone']), required=True, help="Invalid or missing parameter phone")
        parser.add_argument('role', type=str, required=True, help="Invalid or missing parameter role")
        parser.add_argument('password', type=inputs.regex(self.pattern['password']), required=True, help="Invalid or missing parameter password")
        args = parser.parse_args(strict=True)
        if not args['role'] in self.roles:
            abort(400, message=f"Invalide parameter role : \'{args['role']}\' doesn\'t exist.")
        return args
"""

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
