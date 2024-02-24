from flask_restful import Resource, reqparse, inputs, abort
from service.user import UserService
from exception.user import UserEmailNotFoundException, UserIdNotFoundException, UserAlreadyExistsException, UserAccessDbException
from flask import jsonify


class UserCheckArgs:
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
    

class UserController(Resource):

    def __init__(self) -> None:
        self.check_args = UserCheckArgs()
        self.user_service = UserService()


    def get(self, user_id: int):
        try:
            user = self.user_service.select_one_by_id(user_id=user_id)
            return jsonify(user.json())
        except UserIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, user_id: int):
        try:
            args = self.check_args.get_user_args()
            self.user_service.update(user_id=user_id, args=args)
            return f"User '{user_id}' successfully updated."
        except UserEmailNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, user_id: int):
        try:
            self.user_service.delete(user_id=user_id)
            return f"User '{user_id}' successfully deleted."
        except UserEmailNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class UserListController(Resource):
    def __init__(self) -> None:
        self.check_args = UserCheckArgs()
        self.user_service = UserService()
    

    def get(self):
        try:
            users = self.user_service.select_all()
            if users:
                return jsonify([user.json() for user in users])
            else:
                return "None users."
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_user_args()
            self.user_service.insert(args=args)
            return f"User '{args['email']}' successfully created."
        except UserAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        
        
       
      
    
