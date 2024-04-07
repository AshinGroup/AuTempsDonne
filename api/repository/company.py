from model.company import Company
from database.db import db
from app import app
from exception.company import CompanyAccessDbException

class CompanyRepo():    

    def select_one_by_id(self, company_id: int) -> Company:
        try:
            company = Company.query.filter_by(id=company_id).first()
            return company
        except Exception:
            raise CompanyAccessDbException(company_id=company_id, method="getting")

    
    def select_all(self) -> list[Company]:
        try:
            companys = Company.query.all()
            if not companys:
                return None
            return companys
        except Exception:
            raise CompanyAccessDbException(company_id=None, method="getting")


    def insert(self, new_company: Company) -> int:
        try:
            with app.app_context():
                db.session.add(new_company)
                db.session.flush()
                new_company_id = new_company.id
                db.session.commit()
                db.session.close()
                return new_company_id
        except Exception:
            raise CompanyAccessDbException(company_id=None, method="creating")
    

    def update(self, company_id: int, update_company: Company) -> None:
        try:
            with app.app_context():
                company = Company.query.filter_by(id=company_id).first()
                company.name = update_company.name
                company.description = update_company.description
                db.session.commit()
                db.session.close()
        except Exception:
            raise CompanyAccessDbException(company_id=company_id, method="updating")


    def delete(self, company_id: int) -> None:
        try:
            with app.app_context():
                company = Company.query.filter_by(id=company_id).first()
                db.session.delete(company)
                db.session.commit()
                db.session.close()
        except Exception:
            raise CompanyAccessDbException(company_id=company_id, method="deleting")