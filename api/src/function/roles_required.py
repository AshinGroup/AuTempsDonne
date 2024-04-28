from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask_restful import abort

def roles_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_roles = claims['roles']
            if not any(role in user_roles for role in roles):
                abort(http_status_code=403, message="You do not have permission to access this resource.")
            return fn(*args, **kwargs)
        return wrapper
    return decorator