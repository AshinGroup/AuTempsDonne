from flask_restful import Resource, reqparse, inputs, abort
from service.company import CompanyService
from exception.company import CompanyIdNotFoundException, CompanyAccessDbException
from flask import jsonify
from flask_jwt_extended import jwt_required
from function.roles_required import roles_required

class CompanyCheckArgs:

    pattern = {'name' : r'\b[A-Za-zÀ-ÖØ-öø-ÿ\-]{1,50}\b'}
    
    def get_company_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter 'name'")
        parser.add_argument('description', type=str, required=True, help="Invalid or missing parameter 'description'")
        args = parser.parse_args(strict=True)
        return args


class CompanyController(Resource):

    def __init__(self) -> None:
        self.check_args = CompanyCheckArgs()
        self.company_service = CompanyService()

    @jwt_required()
    def get(self, company_id: int):
        try:
            company = self.company_service.select_one_by_id(company_id=company_id)
            return jsonify(company.json())
        except CompanyIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CompanyAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   
    @jwt_required()
    @roles_required([1])
    def put(self, company_id: int):
        try:
            args = self.check_args.get_company_args()
            self.company_service.update(company_id=company_id, args=args)
            return jsonify({'message': f"Company '{company_id}' successfully updated."})
        except CompanyIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CompanyAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   
    @jwt_required()
    @roles_required([1])
    def delete(self, company_id: int):
        try:
            self.company_service.delete(company_id=company_id)
            return jsonify({'message': f"Company '{company_id}' successfully deleted."})
        except CompanyIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CompanyAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class CompanyListController(Resource):
    def __init__(self) -> None:
        self.check_args = CompanyCheckArgs()
        self.company_service = CompanyService()
    
    @jwt_required()
    def get(self):
        try:
            categories = self.company_service.select_all()
            if categories:
                return jsonify([company.json() for company in categories])
            else:
                return jsonify({'message': "No company found."})
        except CompanyAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        
    @jwt_required()
    @roles_required([1])
    def post(self):
        try:
            args = self.check_args.get_company_args()
            new_company_id = self.company_service.insert(args=args)
            return jsonify({'message': f"Company '{args['name']}' successfully created.", 'company_id': new_company_id})
        except CompanyAccessDbException as e:
            abort(http_status_code=500, message=str(e))
