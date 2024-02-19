from model.activity import Activity
from repository.activity import ActivityRepo
from exception.activity import ActivityIdNotFoundException

class ActivityService:

    def __init__(self) -> None:
        self.activity_repo = ActivityRepo()


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
        new_activity = Activity(type=args['type'], date=args['date'], activity_location=args['activity_location'])
        self.activity_repo.insert(new_activity=new_activity)
    

    def update(self, activity_id: int, args: dict):
        update_activity = Activity(type=args['type'], date=args['date'], activity_location=args['activity_location'])
        activity = self.activity_repo.select_one_by_id(activity_id=activity_id)
        
        if not activity:
            raise ActivityIdNotFoundException(activity_id=activity_id)
        
        self.activity_repo.update(activity_id=activity.activity_id, update_activity=update_activity)
        
        
    def delete(self, activity_id: str):
        if not self.activity_repo.select_one_by_id(activity_id=activity_id):
            raise ActivityIdNotFoundException(activity_id=activity_id)
        self.activity_repo.delete(activity_id=activity_id)
