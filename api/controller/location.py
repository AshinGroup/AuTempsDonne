from flask_restful import Resource, reqparse, inputs, abort
from service.location import LocationService
from exception.location import LocationIdNotFoundException, LocationAccessDbException
from flask import jsonify

class LocationCheckArgs:

    pattern = {'address' : r'\b[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-,.#]{1,100}\b',
               'zip_code': r'\b\d{5}(?:[-\s]?\d{4})?\b',
               'country' : r'\b[A-Za-z\s\-\'.,()]{1,30}\b'}
    
    def get_location_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('address', type=inputs.regex(self.pattern['address']), required=True, help="Invalid or missing parameter 'address'")
        parser.add_argument('zip_code', type=inputs.regex(self.pattern['zip_code']), required=True, help="Invalid or missing parameter 'zip_code'")
        parser.add_argument('country', type=inputs.regex(self.pattern['country']), required=True, help="Invalid or missing parameter 'country'")
        parser.add_argument('city', type=inputs.regex(self.pattern['country']), required=True, help="Invalid or missing parameter 'city'")
        args = parser.parse_args(strict=True)
        return args


class LocationController(Resource):

    def __init__(self) -> None:
        self.check_args = LocationCheckArgs()
        self.location_service = LocationService()


    def get(self, location_id: int):
        try:
            location = self.location_service.select_one_by_id(location_id=location_id)
            return jsonify(location.json())
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, location_id: int):
        try:
            args = self.check_args.get_location_args()
            self.location_service.update(location_id=location_id, args=args)
            return jsonify({'message': f"Location '{location_id}' successfully updated."})
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, location_id: int):
        try:
            self.location_service.delete(location_id=location_id)
            return jsonify({'message': f"Location '{location_id}' successfully deleted."})
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class LocationListController(Resource):
    def __init__(self) -> None:
        self.check_args = LocationCheckArgs()
        self.location_service = LocationService()
    

    def get(self):
        try:
            events = self.location_service.select_all()
            if events:
                return jsonify([location.json() for location in events])
            else:
                return jsonify({'message': "No location found."})
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_location_args()
            new_location_id = self.location_service.insert(args=args)
            return jsonify({'message': f"Location '{args['address']}' successfully created.", 'location_id': new_location_id})
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))
