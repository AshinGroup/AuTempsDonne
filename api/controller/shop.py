from flask_restful import Resource, reqparse, inputs, abort
from service.shop import ShopService
from exception.shop import *
from exception.company import *
from exception.location import *
from flask import jsonify


class ShopCheckArgs:

    def get_shop_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument(
            "name", type=str, required=True, help="Invalid or missing parameter 'name'."
        )
        parser.add_argument(
            "company_id",
            type=int,
            required=True,
            help="Invalid or missing parameter 'company_id'.",
        )
        parser.add_argument(
            "location_id",
            type=int,
            required=True,
            help="Invalid or missing parameter 'location_id'.",
        )
        args = parser.parse_args(strict=True)
        return args


class ShopController(Resource):

    def __init__(self) -> None:
        self.check_args = ShopCheckArgs()
        self.shop_service = ShopService()

    def get(self, shop_id: int):
        try:
            shop = self.shop_service.select_one_by_id(shop_id=shop_id)
            return jsonify(shop.json())
        except ShopIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ShopAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except CompanyAccessDbException as e:
            abort(http_status_code=500, message=str(e))

    def put(self, shop_id: int):
        try:
            args = self.check_args.get_shop_args()
            self.shop_service.update(shop_id=shop_id, args=args)
            return jsonify({"message": f"Shop '{shop_id}' successfully updated."})
        except ShopIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CompanyIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ShopAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))

    def delete(self, shop_id: int):
        try:
            self.shop_service.delete(shop_id=shop_id)
            return jsonify({"message": f"Shop '{shop_id}' successfully deleted."})
        except ShopIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except ShopAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class ShopListController(Resource):
    def __init__(self) -> None:
        self.check_args = ShopCheckArgs()
        self.shop_service = ShopService()

    def get(self):
        try:
            shops = self.shop_service.select_all()
            if shops:
                return jsonify([shop.json() for shop in shops])
            else:
                return jsonify({"message": "No shops found."})
        except ShopAccessDbException as e:
            abort(http_status_code=500, message=str(e))

    def post(self):
        try:
            args = self.check_args.get_shop_args()
            self.shop_service.insert(args=args)
            return jsonify({"message": f"Shop successfully created."})
        except ShopAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except CompanyIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CompanyAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except LocationIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except LocationAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class ShopPageController(Resource):
    def __init__(self) -> None:
        self.shop_service = ShopService()

    def get(self, page: int):
        try:
            shops = self.shop_service.select_per_page(page=page)
            if shops:
                return jsonify(
                    {
                        "max_pages": shops["max_pages"],
                        "shops": [shop.json() for shop in shops["shops"]],
                    }
                )
            else:
                return jsonify({"message": "No shops found."})
        except ShopAccessDbException as e:
            abort(http_status_code=500, message=str(e))
