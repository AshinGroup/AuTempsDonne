class CompanyIdNotFoundException(Exception):
    def __init__(self, company_id: int) -> None:
        self.company_id = company_id

    def __str__(self) -> str:
        return f"Company with id '{self.company_id}' not found."
    

class CompanyAccessDbException(Exception):
    def __init__(self, company_id: int, method: str) -> None:
        self.company_id = company_id
        self.method = method

    def __str__(self) -> str:
        if self.company_id:
            return f"Error {self.method} company '{self.company_id}'."
        else: 
            return f"Error {self.method} companys."
