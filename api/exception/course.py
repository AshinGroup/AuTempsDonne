class CourseTitleNotFoundException(Exception):
    def __init__(self, title: str) -> None:
        self.title = title

    def __str__(self) -> str:
        return f"Course with title '{self.title}' not found."
    

class CourseIdNotFoundException(Exception):
    def __init__(self, course_id: int) -> None:
        self.course_id = course_id

    def __str__(self) -> str:
        return f"Course with id '{self.course_id}' not found."


class CourseAlreadyExistsException(Exception):
    def __init__(self, title: str) -> None:
        self.title = title

    def __str__(self) -> str:
        return f"Course with title '{self.title}' already exists."
    

class CourseAccessDbException(Exception):
    def __init__(self, course_id: int, method: str) -> None:
        self.course_id = course_id
        self.method = method

    def __str__(self) -> str:
        if self.course_id:
            return f"Error {self.method} course '{self.course_id}'."
        else: 
            return f"Error {self.method} courses."

    
