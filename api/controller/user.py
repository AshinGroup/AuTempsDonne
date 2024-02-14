from flask_restful import Resource, reqparse, inputs, abort

class UserCheckArgs:
    pattern = {'name' : r'\b[A-Za-zÀ-ÖØ-öø-ÿ\-]{1,30}\b', # Validates names with letters and hyphens, 1 to 30 characters.
                'phone' : r'\b(?:\+?\d{1,3}[-.●]?)?(?:\(\d{1,4}\)[-.\●]?)?\d{6,}\b', #Validates phone numbers with optional international and regional codes, at least six digits.
                'mail' : '([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'} # Validates standard email addresses.
    
    roles = ['volunteer', 'beneficiary', 'admin']
    
    def get_user_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('first_name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter first name")
        parser.add_argument('last_name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter last name")
        parser.add_argument('mail', type=inputs.regex(self.pattern['mail']), required=True, help="Invalid or missing parameter mail")
        parser.add_argument('phone', type=inputs.regex(self.pattern['phone']), required=True, help="Invalid or missing parameter phone")
        parser.add_argument('role', type=str, required=True, help="Invalid or missing parameter role")
        args = parser.parse_args(strict=True)
        if not args['role'] in self.roles:
            abort(400, message=f"Invalide parameter role : \'{args['role']}\' doesn\'t exist.")
        return args
    

class UserController(Resource):
   def get(self):
        return 'Hello, World!'
   
   def put(self):
       pass
   
    
class UserListController(Resource):
    def __init__(self) -> None:
        self.check_args = UserCheckArgs()
    
    
    def post(self):
        args = self.check_args.get_user_args()
        return args
      
    
