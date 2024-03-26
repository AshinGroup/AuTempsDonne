class StorageIdNotFoundException(Exception):
    def __init__(self, storage_id: int) -> None:
        self.storage_id = storage_id

    def __str__(self) -> str:
        return f"Storage with id '{self.storage_id}' not found."
    

class StorageIdGroupNotFoundException(Exception):
    def __init__(self, group: int) -> None:
        self.group = group

    def __str__(self) -> str:
        return f"Storage group with id '{self.group}' not found."
    


class StorageAccessDbException(Exception):
    def __init__(self, storage_id: int, method: str) -> None:
        self.storage_id = storage_id
        self.method = method

    def __str__(self) -> str:
        if self.storage_id:
            return f"Error {self.method} storage '{self.storage_id}'."
        else: 
            return f"Error {self.method} storages."
