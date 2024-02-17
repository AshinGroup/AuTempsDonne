from model.user import User
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


    def insert(self, new_user: User) -> None:
        try:
            with app.app_context():
                new_user.password = hash_password(new_user.password)
                db.session.add(new_user)
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

                    
                   
         
            
        
    
    