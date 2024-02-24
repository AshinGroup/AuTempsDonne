class CourseIdNotFoundException(Exception):
    def __init__(self, course_id: int) -> None:
        self.course_id = course_id

    def __str__(self) -> str:
        return f"Course with id '{self.course_id}' not found."


class UserIdNotFoundException(Exception):
    def __init__(self, user_id: int) -> None:
        self.user_id = user_id

    def __str__(self) -> str:
        return f"User with id '{self.user_id}' not found."


class FollowsCourseAlreadyExistsException(Exception):
    def __init__(self, user_id:int, activity_id: int) -> None:
        self.email = email

    def __str__(self) -> str:
        return f"User id '{self.user_id}' already follows course id '{self.activity_id}'."


class CourseAccessDbException(Exception):
    def __init__(self, course_id: int, method: str) -> None:
        self.course_id = course_id
        self.method = method

    def __str__(self) -> str:
        if self.course_id:
            return f"Error {self.method} course '{self.course_id}'."
        else: 
            return f"Error {self.method} courses."

 

class UserAccessDbException(Exception):
    def __init__(self, user_id: int, method: str) -> None:
        self.user_id = user_id
        self.method = method

    def __str__(self) -> str:
        if self.user_id:
            return f"Error {self.method} user '{self.user_id}'."
        else: 
            return f"Error {self.method} users."

    
