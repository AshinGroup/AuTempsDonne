from flask_restful import Resource, reqparse, inputs, abort
from service.warehouse import WarehouseService
from exception.warehouse import *
from exception.type import *
from exception.location import LocationIdNotFoundException
from flask import jsonify
from flask_jwt_extended import jwt_required
from function.roles_required import roles_required

class WarehouseCheckArgs:
        
    def get_warehouse_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help="Invalid or missing parameter 'name'.")
        parser.add_argument('location_id', type=int, required=True, help="Invalid or missing parameter 'location_id'.")
        args = parser.parse_args(strict=True)
        return args


class WarehouseController(Resource):

    def __init__(self) -> None:
        self.check_args = WarehouseCheckArgs()
        self.warehouse_service = WarehouseService()

    @jwt_required()
    def get(self, warehouse_id: int):
        try:
            warehouse = self.warehouse_service.select_one_by_id(warehouse_id=warehouse_id)
            return jsonify(warehouse.json())
        except WarehouseIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except WarehouseAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   
    @jwt_required()
    @roles_required([1])
    def put(self, warehouse_id: int):
        try:
            args = self.check_args.get_warehouse_args()
            self.warehouse_service.update(warehouse_id=warehouse_id, args=args)
            return jsonify({'message': f"Warehouse '{warehouse_id}' successfully updated."})
        except WarehouseIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except WarehouseIdGroupNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except WarehouseAccessDbException as e:
            abort(http_status_code=500, message=str(e))     
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))   
   
    @jwt_required()
    @roles_required([1])
    def delete(self, warehouse_id: int):
        try:
            self.warehouse_service.delete(warehouse_id=warehouse_id)
            return jsonify({'message': f"Warehouse '{warehouse_id}' successfully deleted."})
        except WarehouseIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except WarehouseAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class WarehouseListController(Resource):
    def __init__(self) -> None:
        self.check_args = WarehouseCheckArgs()
        self.warehouse_service = WarehouseService()
    
    @jwt_required()
    def get(self):
        try:
            warehouses = self.warehouse_service.select_all()
            if warehouses:
                return jsonify([warehouse.json() for warehouse in warehouses])
            else:
                return jsonify({'message': "No warehouses found."})
        except WarehouseAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        
    @jwt_required()
    @roles_required([1])
    def post(self):
        try:
            args = self.check_args.get_warehouse_args()
            self.warehouse_service.insert(args=args)
            return jsonify({'message': f"Warehouse successfully created."})
        except WarehouseAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except WarehouseIdGroupNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except TypeAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))


class WarehousePageController(Resource):
    def __init__(self) -> None:
        self.warehouse_service = WarehouseService()
    
    @jwt_required()
    def get(self, page: int):
        try:
            warehouses = self.warehouse_service.select_per_page(page=page)
            if warehouses:
                return jsonify({'max_pages': warehouses['max_pages'], 'warehouses': [warehouse.json() for warehouse in warehouses['warehouses']]})
            else:
                return jsonify({'message': "No warehouses found."})
        except WarehouseAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        