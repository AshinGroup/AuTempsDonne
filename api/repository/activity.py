from model.activity import Activity
from database.db import db
from app import app
from exception.activity import ActivityAccessDbException

class ActivityRepo():    

    def select_one_by_id(self, activity_id: int) -> Activity:
        try:
            activity = Activity.query.filter_by(activity_id=activity_id).first()
            return activity
        except Exception:
            raise ActivityAccessDbException(activity_id=activity_id, method="getting")

    
    def select_all(self) -> list[Activity]:
        try:
            activities = Activity.query.all()
            if not activities:
                return None
            return activities
        except Exception:
            raise ActivityAccessDbException(activity_id=None, method="getting")


    def insert(self, new_activity: Activity) -> None:
        try:
            with app.app_context():
                db.session.add(new_activity)
                db.session.commit()
                db.session.close()
        except Exception:
            raise ActivityAccessDbException(activity_id=None, method="creating")
    

    def update(self, activity_id: int, update_activity: Activity) -> None:
        try:
            with app.app_context():
                activity = Activity.query.filter_by(activity_id=activity_id).first()
                activity.type = update_activity.type
                activity.date = update_activity.date
                activity.activity_location = update_activity.activity_location
                db.session.commit()
                db.session.close()
        except Exception:
            raise ActivityAccessDbException(activity_id=activity_id, method="updating")


    def delete(self, activity_id: int) -> None:
        try:
            activity = Activity.query.filter_by(activity_id=activity_id).first()
            with app.app_context():
                db.session.delete(activity)
                db.session.commit()
                db.session.close()
        except Exception:
            raise ActivityAccessDbException(activity_id=activity_id, method="deleting")