from flask_restful import Resource, reqparse, inputs, abort
from service.storage import StorageService
from exception.storage import *
from exception.type import *
from flask import jsonify

class StorageCheckArgs:
        
    def get_storage_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help="Invalid or missing parameter 'name'.")
        parser.add_argument('warehouse_id', type=int, required=True, help="Invalid or missing parameter 'warehouse_id'.")
        args = parser.parse_args(strict=True)
        return args


class StorageController(Resource):

    def __init__(self) -> None:
        self.check_args = StorageCheckArgs()
        self.storage_service = StorageService()


    def get(self, storage_id: int):
        try:
            storage = self.storage_service.select_one_by_id(storage_id=storage_id)
            return jsonify(storage.json())
        except StorageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except StorageAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, storage_id: int):
        try:
            args = self.check_args.get_storage_args()
            self.storage_service.update(storage_id=storage_id, args=args)
            return jsonify({'message': f"Storage '{storage_id}' successfully updated."})
        except StorageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except StorageAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, storage_id: int):
        try:
            self.storage_service.delete(storage_id=storage_id)
            return jsonify({'message': f"Storage '{storage_id}' successfully deleted."})
        except StorageIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except StorageAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class StorageListController(Resource):
    def __init__(self) -> None:
        self.check_args = StorageCheckArgs()
        self.storage_service = StorageService()
    

    def get(self):
        try:
            storages = self.storage_service.select_all()
            if storages:
                return jsonify([storage.json() for storage in storages])
            else:
                return jsonify({'message': "No storages found."})
        except StorageAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_storage_args()
            self.storage_service.insert(args=args)
            return jsonify({'message': f"Storage successfully created."})
        except StorageAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class StoragePageController(Resource):
    def __init__(self) -> None:
        self.storage_service = StorageService()
    

    def get(self, page: int):
        try:
            storages = self.storage_service.select_per_page(page=page)
            if storages:
                return jsonify({'max_pages': storages['max_pages'], 'storages': [storage.json() for storage in storages['storages']]})
            else:
                return jsonify({'message': "No storages found."})
        except StorageAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        