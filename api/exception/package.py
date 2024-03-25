class PackageIdNotFoundException(Exception):
    def __init__(self, package_id: int) -> None:
        self.package_id = package_id

    def __str__(self) -> str:
        return f"Package with id '{self.package_id}' not found."
    

class PackageIdGroupNotFoundException(Exception):
    def __init__(self, group: int) -> None:
        self.group = group

    def __str__(self) -> str:
        return f"Package group with id '{self.group}' not found."
    


class PackageAccessDbException(Exception):
    def __init__(self, package_id: int, method: str) -> None:
        self.package_id = package_id
        self.method = method

    def __str__(self) -> str:
        if self.package_id:
            return f"Error {self.method} package '{self.package_id}'."
        else: 
            return f"Error {self.method} packages."
