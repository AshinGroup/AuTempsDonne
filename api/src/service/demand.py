from datetime import datetime
from model.demand import Demand
from repository.demand import DemandRepo
from exception.demand import DemandIdNotFoundException
from exception.shop import ShopIdNotFoundException
from service.shop import ShopService
from service.qr_code import QrCodeService
from service.wasabi_s3 import WasabiS3


class DemandService:

    def __init__(self) -> None:
        self.demand_repo = DemandRepo()
        self.shop_service = ShopService()
        self.qrcode_service = QrCodeService()
        self.wasabi_service = WasabiS3()

    def select_one_by_id(self, demand_id: int):
        demand = self.demand_repo.select_one_by_id(demand_id=demand_id)
        if demand:
            return demand
        else:
            raise DemandIdNotFoundException(demand_id=demand_id)

    def select_per_page(self, page: int) -> list[Demand]:
        demands = self.demand_repo.select_per_page(page=page)
        return demands

    def select_by_search(self, page: int, search: str) -> list[Demand]:
        demands = self.demand_repo.select_by_search(page=page, search=search)
        return demands

    def select_all(self):
        demands = self.demand_repo.select_all()
        return demands

    def insert(self, args: dict):
        time = datetime.now()
        formatted_time = time.strftime("%Y-%m-%d %H:%M:%S")
        data = {"packages": [eval(package) for package in args["packages"]]}
        for a in data:
            print(type(a))
        shop = self.shop_service.select_one_by_id(args["shop_id"])
        shop_details = {"name": shop.name, "location": shop.location.description}

        png_src, pdf_src = self.qrcode_service.generate_qrcode(data, shop_details)
        new_demand = Demand(
            submitted_datetime=formatted_time,
            limit_datetime=args["limit_datetime"],
            status=args["status"],
            additional=args["additional"],
            shop_id=args["shop_id"],
            qr_code=png_src,
            pdf=pdf_src,
        )

        self.shop_service.select_one_by_id(shop_id=new_demand.shop_id)
        self.demand_repo.insert(new_demand=new_demand)

    def update(self, demand_id: int, args: dict):
        update_demand = Demand(
            limit_datetime=args["limit_datetime"],
            status=args["status"],
            additional=args["additional"],
            shop_id=args["shop_id"],
        )
        demand = self.demand_repo.select_one_by_id(demand_id=demand_id)

        if not demand:
            raise DemandIdNotFoundException(demand_id=demand_id)

        if not self.shop_service.select_one_by_id(update_demand.shop_id):
            raise ShopIdNotFoundException

        self.shop_service.select_one_by_id(shop_id=update_demand.shop_id)

        self.demand_repo.update(demand_id=demand_id, update_demand=update_demand)

    def delete(self, demand_id: str):
        demand = self.select_one_by_id(demand_id=demand_id)
        self.wasabi_service.delete_file(demand.pdf)
        self.demand_repo.delete(demand_id=demand_id)
