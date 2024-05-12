from flask_restful import Resource, reqparse, abort
from service.roadmap import RoadmapService
from exception.location import LocationAccessDbException, LocationIdNotFoundException
from flask import jsonify
from flask_jwt_extended import jwt_required
from function.roles_required import roles_required

class RoadmapCheckArgs:
    def get_roadmap_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('locations_id', type=int, required=True, action='append', help="Invalid or missing parameter 'locations_id'.")
        args = parser.parse_args(strict=True)
        return args
    
class RoadmapController(Resource):
    def __init__(self) -> None:
        self.roadmap_service = RoadmapService()
        self.check_args = RoadmapCheckArgs()

    @jwt_required()
    def get(self):
        try:
            args = self.check_args.get_roadmap_args()
            response= self.roadmap_service.generate_roadmap(args['locations_id'])
            return jsonify(response)
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
       


   

   