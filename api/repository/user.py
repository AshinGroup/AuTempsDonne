from model.user import User
from model.course import Course
from model.activity import Activity
from model.role import Role
from database.db import db
from app import app
from exception.user import UserAccessDbException
from function.hash import hash_password


class UserRepo():
    def select_one_by_email(self, email: str) -> User:
        try:
            user = User.query.filter_by(email=email).first()
            return user
        except Exception:
            raise UserAccessDbException(user_id=None, method="getting")
        
    
    def select_one_by_id(self, user_id: int) -> User:
        try:
            user = User.query.filter_by(user_id=user_id).first()
            return user
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="getting")
        
    
    def select_by_email(self, email: str) -> User:
        try:
            users = User.query.filter_by(email=email).all()
            return users
        except Exception:
            raise UserAccessDbException(user_id=None, method="getting")

    
    def select_all(self) -> list[User]:
        try:
            users = User.query.all()
            if not users:
                return None
            return users
        except Exception:
            raise UserAccessDbException(user_id=None, method="getting")


    def select_all_activities(self, user: User) -> list[Activity]:
        try:
            user_activities = user.activity
            if not user_activities:
                return None
            return user_activities
        except Exception:
            raise UserAccessDbException(user_id=user.user_id, method="getting")
        
    
    def select_all_courses(self, user: User) -> list[Course]:
        try:
            user_courses = user.course
            if not user_courses:
                return None
            return user_courses
        except Exception:
            raise UserAccessDbException(user_id=user.user_id, method="getting")


    def insert(self, new_user: User, role_id: int) -> None:
        try:
            with app.app_context():
                new_user.password = hash_password(new_user.password)
                db.session.add(new_user)
                user_role = Role.query.filter_by(role_id=role_id).first()
                new_user.role.append(user_role)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=None, method="creating")
        
    

    def update(self, user_id: int, update_user: User) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                user.first_name = update_user.first_name
                user.last_name = update_user.last_name
                user.email = update_user.email
                user.phone = update_user.phone
                user.role = update_user.role
                user.password = hash_password(update_user.password)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="updating")


    def delete(self, user_id: int) -> None:
        try:
            user = User.query.filter_by(user_id=user_id).first()
            with app.app_context():
                db.session.delete(user)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting")

                    
                   
         
            
        
    
    