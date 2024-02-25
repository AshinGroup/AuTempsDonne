from model.course import Course
from database.db import db
from app import app
from exception.course import CourseAccessDbException

class CourseRepo:

    def select_one_by_title(self, title: str) -> Course:
        try:
            course = Course.query.filter_by(course=course).first()
            return course
        except Exception:
            raise CourseAccessDbException(course_id=None, method="getting")
    

    def select_one_by_id(self, course_id: int) -> Course:
        try:
            course = Course.query.filter_by(course_id=course_id).first()
            return course
        except Exception:
            raise CourseAccessDbException(course_id=course_id, method="getting")
        
    
    def select_by_title(self, title: str) -> Course:
        try:
            courses = Course.query.filter_by(title=title).all()
            return courses
        except Exception:
            raise CourseAccessDbException(course_id=None, method="getting")

    
    def select_all(self) -> list[Course]:
        try:
            courses = Course.query.all()
            if not courses:
                return None
            return courses
        except Exception:
            raise CourseAccessDbException(course_id=None, method="getting")


    def insert(self, new_course: Course) -> None:
        try:
            with app.app_context():
                db.session.add(new_course)
                db.session.commit()
                db.session.close()
        except Exception:
            raise CourseAccessDbException(course_id=None, method="creating")
    

    def update(self, course_id: int, update_course: Course) -> None:
        try:
            with app.app_context():
                course = Course.query.filter_by(course_id=course_id).first()
                course.title = update_course.title
                course.description = update_course.description
                db.session.commit()
                db.session.close()
        except Exception:
            raise CourseAccessDbException(course_id=course_id, method="updating")


    def delete(self, course_id: int) -> None:
        try:
            course = Course.query.filter_by(course_id=course_id).first()
            with app.app_context():
                db.session.delete(course)
                db.session.commit()
                db.session.close()
        except Exception:
            raise CourseAccessDbException(course_id=course_id, method="deleting")