from model.user import User
from repository.user import UserRepo
from exception.user import UserFollowsCourseAlreadyExistsException, UserParticipatesActivityAlreadyExistsException, UserIsRoleAlreadyExistsException
from exception.user import UserEmailNotFoundException, UserIdNotFoundException, UserAlreadyExistsException, UserRoleNotEmptyException
from exception.user import UserFollowsCourseNotFoundException, UserParticipatesActivityNotFoundException, UserIsRoleNotFoundException
from exception.activity import ActivityIdNotFoundException
from exception.course import CourseIdNotFoundException
from exception.role import RoleIdNotFoundException
from service.role import RoleService
from service.course import CourseService
from service.activity import ActivityService

class UserService:

    def __init__(self) -> None:
        self.user_repo = UserRepo()
        self.role_service = RoleService()
        self.course_service = CourseService()
        self.activity_service = ActivityService()


    def select_one_by_id(self, user_id: int) -> User:
        user = self.user_repo.select_one_by_id(user_id=user_id)
        if user:
            return user
        else:
            raise UserIdNotFoundException(user_id=user_id)


    def select_one_by_email(self, email: str) -> User:
        user = self.user_repo.select_one_by_email(email=email)
        if user:
            return user
        else:
            raise UserEmailNotFoundException(email=email)
        

    def select_all(self) -> list[User]:
        users = self.user_repo.select_all()
        return users


    def insert(self, args: dict) -> None:
        new_user = User(first_name=args['first_name'], last_name=args['last_name'], email=args['email'], phone=args['phone'], password=args['password']) 
        if self.user_repo.select_one_by_email(email=new_user.email):
            raise UserAlreadyExistsException(new_user.email)
        if not self.role_service.select_one_by_id(args['role_id']):
            raise RoleIdNotFoundException
        self.user_repo.insert(new_user=new_user, role_id=args['role_id'])

    
    def insert_activity(self, user_id: int, activity_id: int) -> None:
        user = self.select_one_by_id(user_id=user_id)
        if not user:
            raise UserIdNotFoundException(user_id=user_id)
        if user.activity:
            for activity in user.activity:
                if activity.activity_id == activity_id:
                    raise UserParticipatesActivityAlreadyExistsException
        if not self.activity_service.select_one_by_id(activity_id=activity_id):
            raise ActivityIdNotFoundException
        self.user_repo.insert_activity(user_id=user_id, activity_id=activity_id)
    

    def insert_course(self, user_id: int, course_id: int) -> None:
        user = self.select_one_by_id(user_id=user_id)
        if not user:
            raise UserIdNotFoundException(user_id=user_id)
        if user.course:
            for course in user.course:
                if course.course_id == course_id:
                    raise UserFollowsCourseAlreadyExistsException
        if not self.course_service.select_one_by_id(course_id=course_id):
            raise CourseIdNotFoundException
        self.user_repo.insert_course(user_id=user_id, course_id=course_id)


    def insert_role(self, user_id: int, role_id: int) -> None:
        user = self.select_one_by_id(user_id=user_id)
        if not user:
            raise UserIdNotFoundException(user_id=user_id)
        if user.role:
            for role in user.role:
                if role.role_id == role_id:
                    raise UserIsRoleAlreadyExistsException
        if not self.role_service.select_one_by_id(role_id=role_id):
            raise RoleIdNotFoundException
        self.user_repo.insert_role(user_id=user_id, role_id=role_id)
             
            
    def update(self, user_id: int, args: dict) -> None:
        update_user = User(first_name=args['first_name'], last_name=args['last_name'], email=args['email'], phone=args['phone'], password=args['password']) 
        user = self.user_repo.select_one_by_id(user_id=user_id)
        
        if not user:
            raise UserIdNotFoundException(user_id=user_id)
        
        users_with_email = self.user_repo.select_by_email(email=update_user.email)
       
        if len(users_with_email) == 2 or users_with_email[0].user_id != user_id:
           raise UserAlreadyExistsException(email=update_user.email)
        
        self.user_repo.update(user_id=user.user_id, update_user=update_user)
        
        
    def delete(self, user_id: int) -> None:
        if not self.user_repo.select_one_by_id(user_id=user_id):
            raise UserIdNotFoundException(user_id=user_id)
        self.user_repo.delete(user_id=user_id)
        

    def delete_activity(self, user_id: int, activity_id: int) -> None:
        user = self.select_one_by_id(user_id=user_id)
        if not user:
            raise UserIdNotFoundException(user_id=user_id)
        activity_exist = False
        if user.activity:
            for activity in user.activity:
                if activity.activity_id == activity_id:
                    activity_exist = True
        if not activity_exist:
            raise UserParticipatesActivityNotFoundException(user_id=user_id, activity_id=activity_id)
        self.user_repo.delete_activity(user_id=user_id, activity_id=activity_id)

            
    def delete_course(self, user_id: int, course_id: int) -> None:
        user = self.select_one_by_id(user_id=user_id)
        if not user:
            raise UserIdNotFoundException(user_id=user_id)
        course_exist = False
        if user.course:
            for course in user.course:
                if course.course_id == course_id:
                    course_exist = True
        if not course_exist:
            raise UserFollowsCourseNotFoundException(user_id=user_id, course_id=course_id)
        self.user_repo.delete_course(user_id=user_id, course_id=course_id)

    
    def delete_role(self, user_id: int, role_id: int) -> None:
        user = self.select_one_by_id(user_id=user_id)
        if not user:
            raise UserIdNotFoundException(user_id=user_id)
        role_exist = False
        if user.role:
            for role in user.role:
                if role.role_id == role_id:
                    role_exist = True
        if len(user.role) == 1:
            raise UserRoleNotEmptyException(user_id=user_id)
        if not role_exist:
            raise UserIsRoleNotFoundException(user_id=user_id, role_id=role_id)
        self.user_repo.delete_role(user_id=user_id, role_id=role_id)

