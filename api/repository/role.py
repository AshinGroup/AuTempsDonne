from model.role import Role
from database.db import db
from app import app
from exception.role import RoleAccessDbException


class RoleRepo():
    
    def select_one_by_id(self, role_id: int) -> Role:
        try:
            role = Role.query.filter_by(id=role_id).first()
            return role
        except Exception:
            raise RoleAccessDbException(role_id=role_id, method="getting")
        
    
    def select_by_name(self, role_name: str) -> Role:
        try:
            roles = Role.query.filter_by(name=role_name).all()
            return roles
        except Exception:
            raise RoleAccessDbException(role_id=None, method="getting")

    
    def select_all(self) -> list[Role]:
        try:
            roles = Role.query.all()
            if not roles:
                return None
            return roles
        except Exception:
            raise RoleAccessDbException(role_id=None, method="getting")

  

    def insert(self, new_role: Role) -> None:
        try:
            with app.app_context():
                db.session.add(new_role)
                db.session.commit()
                db.session.close()
        except Exception:
            raise RoleAccessDbException(role_id=None, method="creating")
    

    def update(self, role_id: int, update_role: Role) -> None:
        try:
            with app.app_context():
                role = Role.query.filter_by(id=role_id).first()
                role.role_name = update_role.role_name
                db.session.commit()
                db.session.close()
        except Exception:
            raise RoleAccessDbException(role_id=role_id, method="updating")


    def delete(self, role_id: int) -> None:
        try:
            role = Role.query.filter_by(id=role_id).first()
            with app.app_context():
                db.session.delete(role)
                db.session.commit()
                db.session.close()
        except Exception:
            raise RoleAccessDbException(id=role_id, method="deleting")

                    
                   
         
            
        
    
    