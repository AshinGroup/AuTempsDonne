from flask_restful import Resource, reqparse, inputs, abort
from service.demand import DemandService
from exception.demand import *
from exception.shop import *
from flask import jsonify

class DemandCheckArgs:

    pattern = {'datetime': r'\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\b',
               'description': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,500}\b'}  # format : YYYY-MM-DD.
        
    
    def get_demand_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('limit_datetime', type=inputs.regex(self.pattern['datetime']), required=True, help="Invalid or missing parameter 'limit_datetime'.")
        parser.add_argument('status', type=int, required=True, help="Invalid or missing parameter 'status'.")
        parser.add_argument('shop_id', type=int, required=True, help="Invalid or missing parameter 'shop_id'.")
        parser.add_argument('additional', type=inputs.regex(self.pattern['description']), required=True, help="Invalid or missing parameter 'additional'.")
        parser.add_argument('packages', action='append', help="Invalid or missing parameter 'packages'.")
        args = parser.parse_args(strict=True)
        return args


class DemandController(Resource):

    def __init__(self) -> None:
        self.check_args = DemandCheckArgs()
        self.demand_service = DemandService()


    def get(self, demand_id: int):
        try:
            demand = self.demand_service.select_one_by_id(demand_id=demand_id)
            return jsonify(demand.json())
        except DemandIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DemandAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except ShopAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, demand_id: int):
        try:
            args = self.check_args.get_demand_args()
            self.demand_service.update(demand_id=demand_id, args=args)
            return jsonify({'message': f"Demand '{demand_id}' successfully updated."})
        except DemandIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ShopIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DemandAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, demand_id: int):
        try:
            self.demand_service.delete(demand_id=demand_id)
            return jsonify({'message': f"Demand '{demand_id}' successfully deleted."})
        except DemandIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DemandAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class DemandListController(Resource):
    def __init__(self) -> None:
        self.check_args = DemandCheckArgs()
        self.demand_service = DemandService()
    

    def get(self):
        try:
            demands = self.demand_service.select_all()
            if demands:
                return jsonify([demand.json() for demand in demands])
            else:
                return jsonify({'message': "No demands found."})
        except DemandAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_demand_args()
            self.demand_service.insert(args=args)
            return jsonify({'message': f"Demand successfully created."})
        except DemandAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except ShopIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ShopAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class DemandPageController(Resource):
    def __init__(self) -> None:
        self.demand_service = DemandService()
    

    def get(self, page: int):
        try:
            demands = self.demand_service.select_per_page(page=page)
            if demands:
                return jsonify({'max_pages': demands['max_pages'], 'demands': [demand.json() for demand in demands['demands']]})
            else:
                return jsonify({'message': "No demands found."})
        except DemandAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

class DemandSearchController(Resource):
    def __init__(self) -> None:
        self.demand_service = DemandService()

    def get(self, page: int, search: str):
        try:
            demands = self.demand_service.select_by_search(page=page, search=search)
            if demands:
                return jsonify({'max_pages': demands['max_pages'], 'demands': [demand.json() for demand in demands['demands']]})
            else:
                return jsonify({'message': "No demands found."})
        except DemandAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        