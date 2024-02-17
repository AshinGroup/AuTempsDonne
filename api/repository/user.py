from model.user import User
from database.db import db
from app import app
from exception.user import UserEmailNotFoundException, UserIdNotFoundException, UserAlreadyExistsException, UserAccessDbException
from function.hash import hash_password

class UserRepo():

    def select_one_by_email(self, email: str) -> User:
        try:
            user = User.query.filter_by(email=email).first()
            return user
        except Exception:
            raise UserAccessDbException(email=email, method="getting")
        
    
    def select_one_by_id(self, user_id: int) -> User:
        try:
            user = User.query.filter_by(user_id=user_id).first()
            return user
        except Exception:
            raise UserAccessDbException(email=None, method="getting")
        
    
    def select_by_email(self, email) -> User:
        try:
            users = User.query.filter_by(email=email)
            return users
        except Exception:
            raise UserAccessDbException(email=None, method="getting")

    
    def select_all(self) -> list[User]:
        try:
            users = User.query.all()
            if not users:
                return None
            return users
        except Exception:
            raise UserAccessDbException(email=None, method="getting")


    def insert(self, new_user: User) -> None:
        try:
            with app.app_context():
                new_user.password = hash_password(new_user.password)
                db.session.add(new_user)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(email=new_user.email, method="creating")
    

    def update(self, update_user: User) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(email=update_user.id).first()
                user.first_name = update_user.first_name
                user.last_name = update_user.last_name
                user.email = update_user.email
                user.phone = update_user.phone
                user.role = update_user.role
                user.password = hash_password(update_user.password)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(email=update_user.email, method="updating")


    def delete(self, email: str) -> None:
        try:
            user = User.query.filter_by(email=email).first()
            with app.app_context():
                db.session.delete(user)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(email=email, method="deleting")

                    
                   
         
            
        
    
    