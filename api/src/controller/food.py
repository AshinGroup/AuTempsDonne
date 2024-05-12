from flask_restful import Resource, reqparse, inputs, abort
from service.food import FoodService
from exception.food import *
from exception.category import *
from flask import jsonify
from flask_jwt_extended import jwt_required
from function.roles_required import roles_required

class FoodCheckArgs:

    pattern = {'description': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,500}\b'}
        
    
    def get_food_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help="Invalid or missing parameter 'name'.")
        parser.add_argument('description', type=inputs.regex(self.pattern['description']), required=True, help="Invalid or missing parameter 'description'.")
        parser.add_argument('category_id', type=int, required=True, help="Invalid or missing parameter 'category_id'.")
        args = parser.parse_args(strict=True)
        return args


class FoodController(Resource):

    def __init__(self) -> None:
        self.check_args = FoodCheckArgs()
        self.food_service = FoodService()

    def get(self, food_id: int):
        try:
            food = self.food_service.select_one_by_id(food_id=food_id)
            return jsonify(food.json())
        except FoodIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except FoodAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except CategoryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   
    @jwt_required()
    @roles_required([1])
    def put(self, food_id: int):
        try:
            args = self.check_args.get_food_args()
            self.food_service.update(food_id=food_id, args=args)
            return jsonify({'message': f"Food '{food_id}' successfully updated."})
        except FoodIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CategoryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except FoodAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   
    @jwt_required()
    @roles_required([1])
    def delete(self, food_id: int):
        try:
            self.food_service.delete(food_id=food_id)
            return jsonify({'message': f"Food '{food_id}' successfully deleted."})
        except FoodIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except FoodAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class FoodListController(Resource):
    def __init__(self) -> None:
        self.check_args = FoodCheckArgs()
        self.food_service = FoodService()
    
    @jwt_required()
    def get(self):
        try:
            foods = self.food_service.select_all()
            if foods:
                return jsonify([food.json() for food in foods])
            else:
                return jsonify({'message': "No foods found."})
        except FoodAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        
    @jwt_required()
    @roles_required([1, 4])
    def post(self):
        try:
            args = self.check_args.get_food_args()
            new_food_id = self.food_service.insert(args=args)
            return jsonify({'message': f"Food '{args['name']}' successfully created.", 'food_id': new_food_id})
        except FoodAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except CategoryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CategoryAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class FoodPageController(Resource):
    def __init__(self) -> None:
        self.food_service = FoodService()
    
    @jwt_required()
    def get(self, page: int):
        try:
            foods = self.food_service.select_per_page(page=page)
            if foods:
                return jsonify({'max_pages': foods['max_pages'], 'foods': [food.json() for food in foods['foods']]})
            else:
                return jsonify({'message': "No foods found."})
        except FoodAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        