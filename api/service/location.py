from model.location import Location
from repository.location import LocationRepo
from exception.location import LocationIdNotFoundException, LocationDetailsException
import requests
import os

class LocationService:

    def __init__(self) -> None:
        self.location_repo = LocationRepo()


    def select_one_by_id(self, location_id: int):
        location = self.location_repo.select_one_by_id(location_id=location_id)
        if location:
            return location
        else:
            raise LocationIdNotFoundException(location_id=location_id)
        

    def select_all(self):
        events = self.location_repo.select_all()
        return events


    def insert(self, args: dict):
        new_location = Location(address=args['address'], zip_code=args['zip_code'], city=args['city'], country=args['country'])
        new_location.latitude, new_location.longitude, new_location.description = self.get_location_details(location=new_location)
        new_location_id = self.location_repo.insert(new_location=new_location)
        return new_location_id
    

    def update(self, location_id: int, args: dict):
        update_location = Location(address=args['address'], zip_code=args['zip_code'], city=args['city'], country=args['country'])
        location = self.location_repo.select_one_by_id(location_id=location_id)
        
        if not location:
            raise LocationIdNotFoundException(location_id=location_id)
        
        self.location_repo.update(location_id=location.location_id, update_location=update_location)
        
        
    def delete(self, location_id: str):
        if not self.location_repo.select_one_by_id(location_id=location_id):
            raise LocationIdNotFoundException(location_id=location_id)
        self.location_repo.delete(location_id=location_id)


    def get_location_details(self, location: Location):
        try:
            argument = f"{location.address},%20{location.zip_code}%20{location.city},%20{location.country}"
            response = requests.get(f"https://geocode.maps.co/search?q={argument}&api_key={os.getenv('GEOCODING_API_KEY')}")
            data = response.json()
            latitude, longitude = self.get_coordinates(data=data)
            description = self.get_description(data=data)
            return latitude, longitude, description
        except Exception:
            raise LocationDetailsException
            
    
    def get_coordinates(self, data: dict):
        return data[0]['lat'], data[0]['lon']
    
    def get_description(self, data: dict):
        return data[0]['display_name']
    
    def generate_roadmap(locations: list[Location]):
        pass