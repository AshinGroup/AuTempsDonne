from model.package import Package
from repository.package import PackageRepo
from exception.package import PackageIdNotFoundException
from exception.food import FoodIdNotFoundException
from exception.storage import StorageIdNotFoundException
from service.food import FoodService
from service.storage import StorageService
from service.demand import DemandService


class PackageService:

    def __init__(self) -> None:
        self.package_repo = PackageRepo()
        self.food_service = FoodService()
        self.storage_service = StorageService()
        self.demand_service = DemandService()
    

    def select_one_by_id(self, package_id: int):
        package = self.package_repo.select_one_by_id(package_id=package_id)
        if package:
            return package
        else:
            raise PackageIdNotFoundException(package_id=package_id)
        
    def select_per_page(self, page: int) -> list[Package]:
        packages = self.package_repo.select_per_page(page=page)
        return packages


    def select_by_search(self, page: int, search: str) -> list[Package]:
        packages = self.package_repo.select_by_search(page=page, search=search)
        return packages


    def select_all(self):
        packages = self.package_repo.select_all()
        return packages

    def insert(self, args: dict):
        new_package = Package(weight=args['weight'], description=args['description'], expiration_date=args['expiration_date'], food_id=args['food_id'], storage_id=args['storage_id'])

        if not self.food_service.select_one_by_id(new_package.food_id):
            raise FoodIdNotFoundException

        if not self.storage_service.select_one_by_id(new_package.storage_id):
            raise StorageIdNotFoundException
        
        self.package_repo.insert(new_package=new_package)


    def insert_qrcode_packages(self, args: dict):
        packages = list()
        self.storage_service.select_one_by_id(storage_id=args['storage_id'])
        self.demand_service.select_one_by_id(demand_id=args['demand_id'])
        for package in args['packages']:
            self.food_service.select_one_by_id(package['food_id'])
            packages.append(Package(weight=package['weight'], 
                                    description=package['description'],
                                    expiration_date=package['expiration_date'],
                                    storage_id=args['storage_id'],
                                    food_id=package['food_id']))

        self.package_repo.insert_packages(packages=packages)
        self.demand_service.update_status(demand_id=args['demand_id'], status=1)

    def update(self, package_id: int, args: dict):
        update_package = Package(weight=args['weight'], description=args['description'], expiration_date=args['expiration_date'], food_id=args['food_id'], storage_id=args['storage_id'])
        package = self.package_repo.select_one_by_id(package_id=package_id)

        if not package:
            raise PackageIdNotFoundException(package_id=package_id)

        if not self.food_service.select_one_by_id(update_package.food_id):
            raise FoodIdNotFoundException

        if not self.storage_service.select_one_by_id(update_package.storage_id):
            raise StorageIdNotFoundException
        

        self.package_repo.update(package_id=package_id, update_package=update_package)

    def delete(self, package_id: str):
        if not self.package_repo.select_one_by_id(package_id=package_id):
            raise PackageIdNotFoundException(package_id=package_id)
        self.package_repo.delete(package_id=package_id)
