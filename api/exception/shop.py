class ShopIdNotFoundException(Exception):
    def __init__(self, shop_id: int) -> None:
        self.shop_id = shop_id

    def __str__(self) -> str:
        return f"Shop with id '{self.shop_id}' not found."
    

class ShopAccessDbException(Exception):
    def __init__(self, shop_id: int, method: str) -> None:
        self.shop_id = shop_id
        self.method = method

    def __str__(self) -> str:
        if self.shop_id:
            return f"Error {self.method} shop '{self.shop_id}'."
        else: 
            return f"Error {self.method} shops."
