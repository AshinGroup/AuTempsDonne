from model.company import Company
from repository.company import CompanyRepo
from exception.company import CompanyIdNotFoundException

class CompanyService:

    def __init__(self) -> None:
        self.company_repo = CompanyRepo()


    def select_one_by_id(self, company_id: int):
        company = self.company_repo.select_one_by_id(company_id=company_id)
        if company:
            return company
        else:
            raise CompanyIdNotFoundException(company_id=company_id)
        

    def select_all(self):
        events = self.company_repo.select_all()
        return events


    def insert(self, args: dict):
        new_company = Company(name=args['name'], description=args['description'])
        new_company_id = self.company_repo.insert(new_company=new_company)
        return new_company_id
    

    def update(self, company_id: int, args: dict):
        update_company = Company(name=args['name'], description=args['description'])
        company = self.company_repo.select_one_by_id(company_id=company_id)
        
        if not company:
            raise CompanyIdNotFoundException(company_id=company_id)
        
        self.company_repo.update(company_id=company_id, update_company=update_company)
        
        
    def delete(self, company_id: str):
        if not self.company_repo.select_one_by_id(company_id=company_id):
            raise CompanyIdNotFoundException(company_id=company_id)
        self.company_repo.delete(company_id=company_id)
