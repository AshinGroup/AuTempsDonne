from flask_restful import Resource, reqparse, inputs, abort
from service.delivery import DeliveryService
from exception.delivery import *
from exception.location import LocationAccessDbException, LocationIdNotFoundException
from exception.type import *
from exception.vehicle import *
from exception.location import *
from exception.package import PackageDeliveryAlreadyExistsException, PackageIdNotFoundException
from flask import jsonify

class DeliveryCheckArgs:

    pattern = {'datetime': r'\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\b'}  # format : YYYY-MM-DD.
        
    
    def get_delivery_args(self, method=None) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('datetime', type=inputs.regex(self.pattern['datetime']), required=True, help="Invalid or missing parameter 'datetime'.")
        parser.add_argument('status', type=int, required=True, help="Invalid or missing parameter 'status'.")
        if method == "post":
            parser.add_argument('locations', type=int, required=True, action='append', help="Invalid or missing parameter 'locations'.")
            parser.add_argument('packages', type=int, required=True, action='append', help="Invalid or missing parameter 'packages'.")
        parser.add_argument('vehicle_id', type=int, required=True,  help="Invalid or missing parameter 'vehicle_id'.")
        args = parser.parse_args(strict=True)
        return args


class DeliveryController(Resource):

    def __init__(self) -> None:
        self.check_args = DeliveryCheckArgs()
        self.delivery_service = DeliveryService()


    def get(self, delivery_id: int):
        try:
            delivery = self.delivery_service.select_one_by_id(delivery_id=delivery_id)
            return jsonify(delivery.json())
        except DeliveryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except VehicleAccessDbException as e:
            abort(http_status_code=500, message=str(e))

   

    def put(self, delivery_id: int):
        try:
            args = self.check_args.get_delivery_args()
            self.delivery_service.update(delivery_id=delivery_id, args=args)
            return jsonify({'message': f"Delivery '{delivery_id}' successfully updated."})
        except DeliveryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e))     
        except VehicleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))   
   

    def delete(self, delivery_id: int):
        try:
            self.delivery_service.delete(delivery_id=delivery_id)
            return jsonify({'message': f"Delivery '{delivery_id}' successfully deleted."})
        except DeliveryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class DeliveryListController(Resource):
    def __init__(self) -> None:
        self.check_args = DeliveryCheckArgs()
        self.delivery_service = DeliveryService()
    

    def get(self):
        try:
            deliveries = self.delivery_service.select_all()
            if deliveries:
                return jsonify([delivery.json() for delivery in deliveries])
            else:
                return jsonify({'message': "No deliveries found."})
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_delivery_args(method="post")
            self.delivery_service.insert(args=args)
            return jsonify({'message': f"Delivery successfully created."})
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except VehicleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except VehicleAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except PackageDeliveryAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except PackageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))


class DeliveryPageController(Resource):
    def __init__(self) -> None:
        self.delivery_service = DeliveryService()
    

    def get(self, page: int):
        try:
            deliveries = self.delivery_service.select_per_page(page=page)
            if deliveries:
                return jsonify({'max_pages': deliveries['max_pages'], 'deliveries': [delivery.json() for delivery in deliveries['deliveries']]})
            else:
                return jsonify({'message': "No deliveries found."})
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

class DeliverySearchController(Resource):
    def __init__(self) -> None:
        self.delivery_service = DeliveryService()

    def get(self, page: int, search: str):
        try:
            deliveries = self.delivery_service.select_by_search(page=page, search=search)
            if deliveries:
                return jsonify({'max_pages': deliveries['max_pages'], 'deliveries': [delivery.json() for delivery in deliveries['deliveries']]})
            else:
                return jsonify({'message': "No deliveries found."})
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

class DeliversToLocationController(Resource):
    def __init__(self) -> None:
        self.delivery_service = DeliveryService()


    def post(self, delivery_id: int, location_id: int) -> None:
        try:
            self.delivery_service.insert_location(delivery_id=delivery_id, location_id=location_id)
            return jsonify({'message': f"Location id '{location_id}' successfully added to delivery id '{delivery_id}'."})
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliveryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliversToLocationAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def delete(self, delivery_id: int, location_id: int) -> None:
        try: 
            self.delivery_service.delete_location(location_id=location_id, delivery_id=delivery_id)
            return jsonify({'message':f"Location id '{location_id}' successfully deleted from delivery id '{delivery_id}'."})
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliveryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliversToLocationNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))