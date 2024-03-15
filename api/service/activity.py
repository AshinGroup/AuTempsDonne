from model.activity import Activity
from repository.activity import ActivityRepo
from exception.activity import ActivityIdNotFoundException
from exception.type import TypeIdNotFoundException
from service.type import TypeService

class ActivityService:

    def __init__(self) -> None:
        self.activity_repo = ActivityRepo()
        self.type_service = TypeService()


    def select_one_by_id(self, activity_id: int):
        activity = self.activity_repo.select_one_by_id(activity_id=activity_id)
        if activity:
            return activity
        else:
            raise ActivityIdNotFoundException(activity_id=activity_id)
        

    def select_all(self):
        activities = self.activity_repo.select_all()
        return activities


    def insert(self, args: dict):
        new_activity = Activity(name=args['name'], datetime=args['datetime'], description=args['description'], capacity=args['capacity'], type_id=args['type_id'])
        self.type_service.select_one_by_id(type_id=new_activity.type_id)
        self.activity_repo.insert(new_activity=new_activity)
    

    def update(self, activity_id: int, args: dict):
        update_activity = Activity(name=args['name'], datetime=args['datetime'], description=args['description'], capacity=args['capacity'], type_id=args['type_id'])
        activity = self.activity_repo.select_one_by_id(activity_id=activity_id)
        
        if not activity:
            raise ActivityIdNotFoundException(activity_id=activity_id)

        self.type_service.select_one_by_id(type_id=update_activity.type_id)
          
        self.activity_repo.update(activity_id=activity.activity_id, update_activity=update_activity)
        
        
    def delete(self, activity_id: str):
        if not self.activity_repo.select_one_by_id(activity_id=activity_id):
            raise ActivityIdNotFoundException(activity_id=activity_id)
        self.activity_repo.delete(activity_id=activity_id)
