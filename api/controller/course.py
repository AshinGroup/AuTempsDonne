from flask_restful import Resource, reqparse, inputs, abort
from service.course import CourseService
from exception.course import CourseTitleNotFoundException, CourseIdNotFoundException, CourseAlreadyExistsException, CourseAccessDbException
from flask import jsonify

class CourseCheckArgs:
    pattern = {'title': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,50}\b',  # lettres, chiffres, espaces et caractères spéciaux courants, de 1 à 50 caractères.
                'description': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\s\d\-,.#]{1,500}\b'  # lettres, chiffres, espaces et caractères spéciaux courants, 1 à 500 caractères.
            }
    
    def get_user_args(self) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('title', type=inputs.regex(self.pattern['title']), required=True, help="Invalid or missing parameter title")
        parser.add_argument('description', type=inputs.regex(self.pattern['description']), required=True, help="Invalid or missing parameter description")
        args = parser.parse_args(strict=True)
        return args


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
            if courses:
                return jsonify([course.json() for course in courses])
            else:
                return "None courses."
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
        
        
       
      
    
