from flask_restful import Resource, reqparse, inputs, abort
from service.roadmap import RoadmapService
from exception.delivery import *
from exception.location import LocationAccessDbException, LocationIdNotFoundException
from flask import jsonify

class RoadmapController(Resource):

    def __init__(self) -> None:
        self.roadmap_service = RoadmapService()


    def post(self, delivery_id: int):
        try:
            delivery = self.roadmap_service.generate_roadmap(delivery_id=delivery_id)
            return jsonify({'message': 'Roadmap successfuly generated.'})
        except DeliveryIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except DeliveryAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
        except Exception as e:
            print(e)


   

   