from model.package import Package
from model.food import Food
from database.db import db
from app import app
from exception.package import PackageAccessDbException


class PackageRepo():

    def select_one_by_id(self, package_id: int) -> Package:
        try:
            package = Package.query.filter_by(id=package_id).first()
            return package
        except Exception:
            raise PackageAccessDbException(
                package_id=package_id, method="getting")

    def select_per_page(self, page: int) -> list[Package]:
        try:
            packages = Package.query.paginate(page=page, per_page=7)
            if not packages:
                return None

            return {'max_pages': packages.pages, 'packages': packages}
        except Exception:
            raise PackageAccessDbException(package_id=None, method="getting")

    def select_by_search(self, page: int, search: str) -> list[Package]:
        try:
            packages = Package.query.join(Food).filter(
                Food.name.like(f'%{search}%')).paginate(page=page, per_page=7)
            if not packages:
                return None

            return {'max_pages': packages.pages, 'packages': packages}
        except Exception:
            raise PackageAccessDbException(user_id=None, method="getting")

    def select_all(self) -> list[Package]:
        try:
            packages = Package.query.all()
            if not packages:
                return None
            return packages
        except Exception:
            raise PackageAccessDbException(package_id=None, method="getting")

    def insert(self, new_package: Package) -> None:
        try:
            with app.app_context():
                db.session.add(new_package)
                db.session.commit()
                db.session.close()
        except Exception:
            raise PackageAccessDbException(package_id=None, method="creating")

    def insert_packages(self, packages: list[Package]) -> None:
        try:
            with app.app_context():
                for package in packages:
                    db.session.add(package)
                db.session.commit()
                db.session.close()
        except Exception:
            raise PackageAccessDbException(package_id=None, method="creating")

    def update(self, package_id: int, update_package: Package) -> None:
        try:
            with app.app_context():
                package = Package.query.filter_by(id=package_id).first()
                package.weight = update_package.weight
                package.expiration_date = update_package.expiration_date
                package.description = update_package.description
                package.food_id = update_package.food_id
                package.storage_id = update_package.storage_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise PackageAccessDbException(
                package_id=package_id, method="updating")

    def delete(self, package_id: int) -> None:
        try:
            with app.app_context():
                package = Package.query.filter_by(id=package_id).first()
                db.session.delete(package)
                db.session.commit()
                db.session.close()
        except Exception:
            raise PackageAccessDbException(
                package_id=package_id, method="deleting")
