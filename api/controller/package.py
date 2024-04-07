from flask_restful import Resource, reqparse, inputs, abort
from service.package import PackageService
from exception.package import *
from exception.food import *
from exception.storage import *
from flask import jsonify

class PackageCheckArgs:

    pattern = {'description': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,500}\b',
               'datetime': r'\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\b'}
        
    
    def get_package_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('weight', type=int, required=True, help="Invalid or missing parameter 'weight'.")
        parser.add_argument('expiration_date', type=inputs.regex(self.pattern['datetime']), required=True, help="Invalid or missing parameter 'expiration_date'.")
        parser.add_argument('description', type=inputs.regex(self.pattern['description']), required=True, help="Invalid or missing parameter 'description'.")
        parser.add_argument('food_id', type=int, required=True, help="Invalid or missing parameter 'food_id'.")
        parser.add_argument('storage_id', type=int, required=True, help="Invalid or missing parameter 'storage_id'.")
        args = parser.parse_args(strict=True)
        return args


class PackageController(Resource):

    def __init__(self) -> None:
        self.check_args = PackageCheckArgs()
        self.package_service = PackageService()


    def get(self, package_id: int):
        try:
            package = self.package_service.select_one_by_id(package_id=package_id)
            return jsonify(package.json())
        except PackageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except PackageAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except FoodAccessDbException as e:
            abort(http_status_code=500, message=str(e))


    def put(self, package_id: int):
        try:
            args = self.check_args.get_package_args()
            self.package_service.update(package_id=package_id, args=args)
            return jsonify({'message': f"Package '{package_id}' successfully updated."})
        except PackageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except PackageIdGroupNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except FoodIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except PackageAccessDbException as e:
            abort(http_status_code=500, message=str(e))  
        except StorageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))     
        except StorageAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
   

    def delete(self, package_id: int):
        try:
            self.package_service.delete(package_id=package_id)
            return jsonify({'message': f"Package '{package_id}' successfully deleted."})
        except PackageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except PackageAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class PackageListController(Resource):
    def __init__(self) -> None:
        self.check_args = PackageCheckArgs()
        self.package_service = PackageService()
    

    def get(self):
        try:
            packages = self.package_service.select_all()
            if packages:
                return jsonify([package.json() for package in packages])
            else:
                return jsonify({'message': "No packages found."})
        except PackageAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_package_args()
            self.package_service.insert(args=args)
            return jsonify({'message': f"Package successfully created."})
        except PackageAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except PackageIdGroupNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except FoodIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except FoodAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except StorageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except StorageAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class PackagePageController(Resource):
    def __init__(self) -> None:
        self.package_service = PackageService()
    

    def get(self, page: int):
        try:
            packages = self.package_service.select_per_page(page=page)
            if packages:
                return jsonify({'max_pages': packages['max_pages'], 'packages': [package.json() for package in packages['packages']]})
            else:
                return jsonify({'message': "No packages found."})
        except PackageAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class PackageSearchController(Resource):
    def __init__(self) -> None:
        self.package_service = PackageService()

    def get(self, page: int, search: str):
        try:
            packages = self.package_service.select_by_search(page=page, search=search)
            if packages:
                return jsonify({'max_pages': packages['max_pages'], 'packages': [package.json() for package in packages['packages']]})
            else:
                return jsonify({'message': "No packages found."})
        except PackageAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        
        