from model.course import Course
from repository.course import CourseRepo
from exception.course import CourseTitleNotFoundException, CourseIdNotFoundException, CourseAlreadyExistsException

class CourseService:

    def __init__(self) -> None:
        self.course_repo = CourseRepo()


    def select_one_by_id(self, course_id: int):
        course = self.course_repo.select_one_by_id(course_id=course_id)
        if course:
            return course
        else:
            raise CourseIdNotFoundException(course_id=course_id)


    def select_one_by_title(self, title: str):
        course = self.course_repo.select_one_by_title(title=title)
        if course:
            return course
        else:
            raise CourseTitleNotFoundException(title=title)
        

    def select_all(self):
        courses = self.course_repo.select_all()
        return courses


    def insert(self, args: dict):
        new_course = Course(title=args['title'], description=args['description'], datetime=args['datetime'], capacity=args['capacity']) 
        if self.course_repo.select_one_by_title(title=new_course.title):
            raise CourseAlreadyExistsException(new_course.title)
        else:
            self.course_repo.insert(new_course=new_course)
    

    def update(self, course_id: int, args: dict):
        update_course = Course(title=args['title'], description=args['description'], datetime=args['datetime'], capacity=args['capacity']) 
        course = self.course_repo.select_one_by_id(course_id=course_id)
        
        if not course:
            raise CourseIdNotFoundException(course_id=course_id)
        
        course_with_title = self.course_repo.select_by_title(title=update_course.title)
       
        if course_with_title:
           raise CourseAlreadyExistsException(title=update_course.title)
        
        self.course_repo.update(course_id=course.course_id, update_course=update_course)
        
        
    def delete(self, course_id: str):
        if not self.course_repo.select_one_by_id(course_id=course_id):
            raise CourseIdNotFoundException(course_id=course_id)
        self.course_repo.delete(course_id=course_id)
