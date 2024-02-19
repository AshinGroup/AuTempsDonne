from flask_restful import Resource, reqparse, inputs, abort
from service.course import CourseService
from exception.course import CourseTitleNotFoundException, CourseIdNotFoundException, CourseAlreadyExistsException, CourseAccessDbException
from flask import jsonify

# Voir qu'elles sont les vérifications à faire pour le titre et la description ?
"""
class CourseCheckArgs:
    pattern = {'name' : r'\b[A-Za-zÀ-ÖØ-öø-ÿ\-]{1,30}\b', # Validates names with letters and hyphens, 1 to 30 characters.
                'phone' : r'\b(?:\+?\d{1,3}[-.●]?)?(?:\(\d{1,4}\)[-.\●]?)?\d{6,}\b', #Validates phone numbers with optional international and regional codes, at least six digits.
                'email' : '([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+', # Validates standard email addresses.
                'password': r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>/?]).{8,}$'}
    
    roles = ['volunteer', 'beneficiary', 'admin']
    
    def get_user_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('first_name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter first name")
        parser.add_argument('last_name', type=inputs.regex(self.pattern['name']), required=True, help="Invalid or missing parameter last name")
        parser.add_argument('email', type=inputs.regex(self.pattern['email']), required=True, help="Invalid or missing parameter email")
        parser.add_argument('phone', type=inputs.regex(self.pattern['phone']), required=True, help="Invalid or missing parameter phone")
        parser.add_argument('role', type=str, required=True, help="Invalid or missing parameter role")
        parser.add_argument('password', type=inputs.regex(self.pattern['password']), required=True, help="Invalid or missing parameter password")
        args = parser.parse_args(strict=True)
        if not args['role'] in self.roles:
            abort(400, message=f"Invalide parameter role : \'{args['role']}\' doesn\'t exist.")
        return args
"""

class CourseController(Resource):

    def __init__(self) -> None:
        self.check_args = CourseCheckArgs()
        self.course_service = CourseService()


    def get(self, course_id: int):
        try:
            course = self.course_service.select_one_by_id(course_id=course_id)
            return jsonify(course.json())
        except CourseIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CourseAccessDbException as e:
            abort(http_status_code=500, message=str(e))
   

    def put(self, course_id: int):
        try:
            args = self.check_args.get_course_args()
            self.course_service.update(course_id=course_id, args=args)
            return f"Course '{course_id}' successfully updated."
        except CourseIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CourseAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except CourseAccessDbException as e:
            abort(http_status_code=500, message=str(e))        
   

    def delete(self, course_id: int):
        try:
            self.course_service.delete(course_id=course_id)
            return f"Course '{course_id}' successfully deleted."
        except CourseIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except CourseAccessDbException as e:
            abort(http_status_code=500, message=str(e)) 
            
   
    
class CourseListController(Resource):
    def __init__(self) -> None:
        self.check_args = CourseCheckArgs()
        self.course_service = CourseService()
    

    def get(self):
        try:
            courses = self.course_service.select_all()
            return jsonify([course.json() for course in courses])
        except CourseAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        

    def post(self):
        try:
            args = self.check_args.get_course_args()
            self.course_service.insert(args=args)
            return f"Course '{args['title']}' successfully created."
        except CourseAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except CourseAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        
        
       
      
    
