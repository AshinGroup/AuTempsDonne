from flask_restful import Resource, reqparse, inputs, abort
from service.role import RoleService
from exception.role import RoleIdNotFoundException, RoleAccessDbException
from flask import jsonify

class RoleCheckArgs:
    pattern = {'name': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,15}\b'} # lettres, chiffres, espaces et caractères spéciaux courants, jusqu'à 15 caractères.
            
    
    def get_role_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter 'role_name'")
        args = parser.parse_args(strict=True)
        return args


class RoleController(Resource):

    def __init__(self) -> None:
        self.check_args = RoleCheckArgs()
        self.role_service = RoleService()


    def get(self, role_id: int):
        try:
            role = self.role_service.select_one_by_id(role_id=role_id)
            return jsonify(role.json())
        except RoleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except RoleAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, role_id: int):
        try:
            args = self.check_args.get_role_args()
            self.role_service.update(role_id=role_id, args=args)
            return jsonify({'message': f"Role '{role_id}' successfully updated."})
        except RoleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except RoleAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, role_id: int):
        try:
            self.role_service.delete(role_id=role_id)
            return jsonify({'message': f"Role '{role_id}' successfully deleted."})
        except RoleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except RoleAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class RoleListController(Resource):
    def __init__(self) -> None:
        self.check_args = RoleCheckArgs()
        self.role_service = RoleService()
    

    def get(self):
        try:
            roles = self.role_service.select_all()
            if roles:
                return jsonify([role.json() for role in roles])
            else:
                return jsonify({'message': "No roles found."})
        except RoleAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_role_args()
            self.role_service.insert(args=args)
            return jsonify({'message': f"Role '{args['name']}' successfully created."})
        except RoleAccessDbException as e:
            abort(http_status_code=500, message=str(e))
