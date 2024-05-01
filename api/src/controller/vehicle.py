from flask_restful import Resource, reqparse, inputs, abort
from service.vehicle import VehicleService
from exception.vehicle import VehicleIdNotFoundException, VehicleAccessDbException
from flask import jsonify

class VehicleCheckArgs:
    
    def get_vehicle_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('license_plate', type=str, required=True, help="Invalid or missing parameter 'license_plate'")
        parser.add_argument('brand', type=str, required=True, help="Invalid or missing parameter 'brand'")
        parser.add_argument('type', type=str, required=True, help="Invalid or missing parameter 'type'")

        args = parser.parse_args(strict=True)
        return args


class VehicleController(Resource):

    def __init__(self) -> None:
        self.check_args = VehicleCheckArgs()
        self.vehicle_service = VehicleService()


    def get(self, vehicle_id: int):
        try:
            vehicle = self.vehicle_service.select_one_by_id(vehicle_id=vehicle_id)
            return jsonify(vehicle.json())
        except VehicleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except VehicleAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, vehicle_id: int):
        try:
            args = self.check_args.get_vehicle_args()
            self.vehicle_service.update(vehicle_id=vehicle_id, args=args)
            return jsonify({'message': f"Vehicle '{vehicle_id}' successfully updated."})
        except VehicleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except VehicleAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, vehicle_id: int):
        try:
            self.vehicle_service.delete(vehicle_id=vehicle_id)
            return jsonify({'message': f"Vehicle '{vehicle_id}' successfully deleted."})
        except VehicleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except VehicleAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class VehicleListController(Resource):
    def __init__(self) -> None:
        self.check_args = VehicleCheckArgs()
        self.vehicle_service = VehicleService()
    

    def get(self):
        try:
            events = self.vehicle_service.select_all()
            if events:
                return jsonify([vehicle.json() for vehicle in events])
            else:
                return jsonify({'message': "No vehicle found."})
        except VehicleAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_vehicle_args()
            self.vehicle_service.insert(args=args)
            return jsonify({'message': f"Vehicle '{args['license_plate']}' successfully created."})
        except VehicleAccessDbException as e:
            abort(http_status_code=500, message=str(e))
