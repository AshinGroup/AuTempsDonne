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
    

    def select_per_page(self, page: int) -> list[User]:
        try:
            users = User.query.paginate(page=page, per_page=10)
            if not users:
                return None
            
            return {'max_pages' : users.pages, 'users': users}
        except Exception:
            raise UserAccessDbException(user_id=None, method="getting")

    def select_by_search(self, page: int, search: str) -> list[User]:
        try:
            users = User.query.filter(User.first_name.like(f'%{search}%') | User.last_name.like(f'%{search}%') |  User.email.like(f'%{search}%')).paginate(page=page, per_page=10)
            if not users:
                return None
            
            return {'max_pages' : users.pages, 'users': users}
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


    def insert(self, new_user: User, role_id: int) -> int:
        try:
            with app.app_context():
                new_user.password = hash_password(new_user.password)
                db.session.add(new_user)
                user_role = Role.query.filter_by(role_id=role_id).first()
                new_user.roles.append(user_role)
                db.session.flush()
                new_user_id = new_user.user_id
                db.session.commit()
                db.session.close()
                return new_user_id
        except Exception:
            raise UserAccessDbException(user_id=None, method="creating")
        
    
    def insert_activity(self, user_id: int, activity_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                activity = Activity.query.filter_by(activity_id=activity_id).first()
                user.activities.append(activity)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="inserting")
        

    def insert_role(self, user_id: int, role_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                role = Role.query.filter_by(role_id=role_id).first()
                user.roles.append(role)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="inserting")     
        
    
    def insert_course(self, user_id: int, course_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                course = Course.query.filter_by(course_id=course_id).first()
                user.courses.append(course)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="inserting")



    def update(self, user_id: int, update_user: User) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                user.first_name = update_user.first_name
                user.last_name = update_user.last_name
                user.email = update_user.email
                user.phone = update_user.phone
                if update_user.password:
                    user.password = hash_password(update_user.password)
                user.status = update_user.status
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="updating")


    def delete(self, user_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                db.session.delete(user)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting")


    def delete_activity(self, user_id: int, activity_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                activity = Activity.query.filter_by(activity_id=activity_id).first()
                user.activity.remove(activity)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting") 
            

    def delete_course(self, user_id: int, course_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                course = Course.query.filter_by(course_id=course_id).first()
                user.course.remove(course)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting") 


    def delete_role(self, user_id: int, role_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(user_id=user_id).first()
                role = Role.query.filter_by(role_id=role_id).first()
                user.role.remove(role)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting") 
            
         
            
        
    
    