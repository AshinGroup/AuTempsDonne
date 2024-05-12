from flask_restful import Resource, reqparse, inputs, abort
from service.type import TypeService
from exception.type import TypeIdNotFoundException, TypeAccessDbException
from flask import jsonify
from flask_jwt_extended import jwt_required
from function.roles_required import roles_required

class TypeCheckArgs:

    pattern = {'name' : r'\b[A-Za-zÀ-ÖØ-öø-ÿ\-]{1,50}\b'}
    
    def get_type_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter 'name'")
        args = parser.parse_args(strict=True)
        return args


class TypeController(Resource):

    def __init__(self) -> None:
        self.check_args = TypeCheckArgs()
        self.type_service = TypeService()

    @jwt_required()
    def get(self, type_id: int):
        try:
            type = self.type_service.select_one_by_id(type_id=type_id)
            return jsonify(type.json())
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   
    @jwt_required()
    @roles_required([1])
    def put(self, type_id: int):
        try:
            args = self.check_args.get_type_args()
            self.type_service.update(type_id=type_id, args=args)
            return jsonify({'message': f"Type '{type_id}' successfully updated."})
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   
    @jwt_required()
    @roles_required([1])
    def delete(self, type_id: int):
        try:
            self.type_service.delete(type_id=type_id)
            return jsonify({'message': f"Type '{type_id}' successfully deleted."})
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class TypeListController(Resource):
    def __init__(self) -> None:
        self.check_args = TypeCheckArgs()
        self.type_service = TypeService()
    
    @jwt_required()
    def get(self):
        try:
            events = self.type_service.select_all()
            if events:
                return jsonify([type.json() for type in events])
            else:
                return jsonify({'message': "No type found."})
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        
    @jwt_required()
    @roles_required([1])
    def post(self):
        try:
            args = self.check_args.get_type_args()
            self.type_service.insert(args=args)
            return jsonify({'message': f"Type '{args['name']}' successfully created."})
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
