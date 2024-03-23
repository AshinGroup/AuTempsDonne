from flask_restful import Resource, reqparse, inputs, abort
from service.category import CategoryService
from exception.category import CategoryIdNotFoundException, CategoryAccessDbException
from flask import jsonify

class CategoryCheckArgs:

    pattern = {'name' : r'\b[A-Za-zÀ-ÖØ-öø-ÿ\-]{1,50}\b'}
    
    def get_category_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter 'name'")
        parser.add_argument('description', type=str, required=True, help="Invalid or missing parameter 'description'")
        args = parser.parse_args(strict=True)
        return args


class CategoryController(Resource):

    def __init__(self) -> None:
        self.check_args = CategoryCheckArgs()
        self.category_service = CategoryService()


    def get(self, category_id: int):
        try:
            category = self.category_service.select_one_by_id(category_id=category_id)
            return jsonify(category.json())
        except CategoryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CategoryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, category_id: int):
        try:
            args = self.check_args.get_category_args()
            self.category_service.update(category_id=category_id, args=args)
            return jsonify({'message': f"Category '{category_id}' successfully updated."})
        except CategoryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CategoryAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, category_id: int):
        try:
            self.category_service.delete(category_id=category_id)
            return jsonify({'message': f"Category '{category_id}' successfully deleted."})
        except CategoryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CategoryAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class CategoryListController(Resource):
    def __init__(self) -> None:
        self.check_args = CategoryCheckArgs()
        self.category_service = CategoryService()
    

    def get(self):
        try:
            events = self.category_service.select_all()
            if events:
                return jsonify([category.json() for category in events])
            else:
                return jsonify({'message': "No category found."})
        except CategoryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_category_args()
            self.category_service.insert(args=args)
            return jsonify({'message': f"Category '{args['name']}' successfully created."})
        except CategoryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
