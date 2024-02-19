from model.course import Course
from repository.course import CourseRepo
#from exception.course import CourseIdNotFoundException, CourseAlreadyExistsException

class CourseService:

    def __init__(self) -> None:
        self.course_repo = CourseRepo()


    def select_one_by_id(self, course_id: int):
        course = self.course_repo.select_one_by_id(course_id=course_id)
        if course:
            return course
        else:
            raise #CourseIdNotFoundException(course_id=course_id)


    # select_one_by_title ?
        

    def select_all(self):
        courses = self.course_repo.select_all()
        return courses


    def insert(self, args: dict):
        new_course = Course(title=args['title'], description=args['description']) 
        #if self.user_repo.select_one_by_email(email=new_user.email):               # faire cette vérification avec 'select_one_by_title' ?
            #raise UserAlreadyExistsException(new_user.email)
        #else:
        self.course_repo.insert(new_course=new_course)
    

    def update(self, course_id: int, args: dict):
        update_course = Course(title=args['title'], description=args['description']) 
        course = self.course_repo.select_one_by_id(course_id=course_id)
        
        if not course:
            raise #CourseIdNotFoundException(course_id=course_id)
        
        #users_with_email = self.user_repo.select_by_email(email=update_user.email)
       
        #if len(users_with_email) == 2 or users_with_email[0].user_id != user_id:
        #   raise UserAlreadyExistsException(email=update_user.email)
        
        self.course_repo.update(course_id=course.course_id, update_course=update_course)
        
        
    def delete(self, course_id: str):
        if not self.course_repo.select_one_by_id(course_id=course_id):
            raise #CourseIdNotFoundException(course_id=course_id)
        self.course_repo.delete(course_id=course_id)
        
            
        

