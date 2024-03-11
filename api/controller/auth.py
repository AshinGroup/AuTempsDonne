from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from flask import jsonify
from auth import jwt
from service.user import UserService

class LoginController(Resource):
    def __init__(self) -> None:
        user_service = UserService()

    def post(self):
        pass

class RegisterController(Resource):
    def __init__(self) -> None:
        user_service = UserService()

    def post(self):
        pass


class ProtectedController(Resource):
    def __init__(self) -> None:
        pass

    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            return jsonify({'message': f"Logged in as {current_user}"})
        except:
            pass
    
    
    