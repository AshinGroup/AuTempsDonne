from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_restful import Resource, abort, reqparse
from flask import jsonify
from auth import jwt
from service.user import UserService
from service.auth import AuthService
from exception.role import RoleIdNotFoundException
from exception.user import UserEmailNotFoundException, UserAlreadyExistsException, UserAccessDbException
from exception.auth import LoginException
from controller.user import UserCheckArgs


class LoginCheckArgs:
    def get_login_args(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help="Missing argument email.")
        parser.add_argument('password', type=str, required=True, help="Missing argument password.")
        args = parser.parse_args(strict=True)
        return args


class LoginController(Resource):
    def __init__(self) -> None:
        self.user_service = UserService()
        self.check_login_args = LoginCheckArgs()
        self.auth_service = AuthService()

    def post(self):
        try:
            roles = list()
            args = self.check_login_args.get_login_args()
            user = self.auth_service.login(email=args['email'], password=args['password'])
            for role in user.roles:
                roles.append(role.id)
            access_token = create_access_token(identity=user.user_id)
            refresh_token = create_refresh_token(identity=user.user_id)
            return jsonify(access_token=access_token, refresh_token=refresh_token, roles=roles)
        except UserEmailNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except LoginException as e:
            abort(http_status_code=400, message=str(e))
        except Exception as e:
            abort(http_status_code=500, message=e)





class RegisterController(Resource):
    def __init__(self) -> None:
        self.user_service = UserService()
        self.user_check_args = UserCheckArgs()

    def post(self):
        try:
            args = self.user_check_args.get_user_args(method="register")
            new_user_id = self.user_service.insert(args=args)
            return jsonify({'message': f"User {args['email']} successfully created.", 'user_id': new_user_id})
        except UserAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except RoleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except Exception as e:
            abort(http_status_code=500, message=e)



class RefreshTokenController(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user)
        return jsonify(access_token=new_token)



class ProtectedController(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return jsonify({'message': f"Logged in as user id '{current_user}'"})
        
    
    
    