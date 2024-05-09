from model.user import User
from model.event import Event
from model.role import Role
from model.delivery import Delivery
from model.collect import Collect
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
            user = User.query.filter_by(id=user_id).first()
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


    def select_all_events(self, user: User) -> list[Event]:
        try:
            user_events = user.event
            if not user_events:
                return None
            return user_events
        except Exception:
            raise UserAccessDbException(user_id=user.id, method="getting")  
        

    def insert(self, new_user: User, role_id: int) -> int:
        try:
            with app.app_context():
                new_user.password = hash_password(new_user.password)
                db.session.add(new_user)
                user_role = Role.query.filter_by(id=role_id).first()
                new_user.roles.append(user_role)
                db.session.flush()
                new_user_id = new_user.id
                db.session.commit()
                db.session.close()
                return new_user_id
        except Exception:
            raise UserAccessDbException(user_id=None, method="creating")
        
    
    def insert_event(self, user_id: int, event_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                event = Event.query.filter_by(id=event_id).first()
                user.events.append(event)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="inserting")
        

    def insert_role(self, user_id: int, role_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                role = Role.query.filter_by(id=role_id).first()
                user.roles.append(role)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="inserting")     
        
    
    def insert_delivery(self, user_id: int, delivery_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                delivery = Delivery.query.filter_by(id=delivery_id).first()
                user.deliveries.append(delivery)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="inserting")   
    
        
    def insert_collect(self, user_id: int, collect_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                collect = Collect.query.filter_by(id=collect_id).first()
                user.collects.append(collect)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="inserting")   


    def insert_shop(self, user_id: int, shop_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                user.shop_id = shop_id
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="inserting")   



    def update(self, user_id: int, update_user: User) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
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
                user = User.query.filter_by(id=user_id).first()
                db.session.delete(user)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting")


    def delete_event(self, user_id: int, event_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                event = Event.query.filter_by(id=event_id).first()
                user.events.remove(event)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting") 

    def delete_role(self, user_id: int, role_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                role = Role.query.filter_by(id=role_id).first()
                user.roles.remove(role)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting") 


    def delete_delivery(self, user_id: int, delivery_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                delivery = Delivery.query.filter_by(id=delivery_id).first()
                user.deliveries.remove(delivery)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting") 
        

    def delete_collect(self, user_id: int, collect_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                collect = Collect.query.filter_by(id=collect_id).first()
                user.collects.remove(collect)
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting") 

    
    def delete_shop(self, user_id: int) -> None:
        try:
            with app.app_context():
                user = User.query.filter_by(id=user_id).first()
                user.shop_id = None
                db.session.commit()
                db.session.close()
        except Exception:
            raise UserAccessDbException(user_id=user_id, method="deleting") 

    
            
            
         
            
        
    
    