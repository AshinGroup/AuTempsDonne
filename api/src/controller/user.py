from flask_restful import Resource, reqparse, inputs, abort
from service.user import UserService
from exception.user import *
from exception.event import EventIdNotFoundException, EventAccessDbException
from exception.role import RoleIdNotFoundException, RoleAccessDbException
from flask import jsonify


class UserCheckArgs:
    pattern = {'name': r'\b[A-Za-zÀ-ÖØ-öø-ÿ\-]{1,30}\b',  # Validates names with letters and hyphens, 1 to 30 characters.
               # Validates phone numbers with optional international and regional codes, at least six digits.
               'phone': r'\b(?:\+?\d{1,3}[-.●]?)?(?:\(\d{1,4}\)[-.\●]?)?\d{6,}\b',
               # Validates standard email addresses.
               'email': '([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+',
               'password': r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>/?]).{8,}$'}

    def get_user_args(self, method: str) -> dict:
        parser = reqparse.RequestParser()
        parser.add_argument('first_name', type=inputs.regex(
            self.pattern['name']), required=True, help="Invalid or missing parameter 'first name'")
        parser.add_argument('last_name', type=inputs.regex(
            self.pattern['name']), required=True, help="Invalid or missing parameter 'last name'")
        parser.add_argument('email', type=inputs.regex(
            self.pattern['email']), required=True, help="Invalid or missing parameter 'email'")
        parser.add_argument('phone', type=inputs.regex(
            self.pattern['phone']), required=True, help="Invalid or missing parameter 'phone'")
        if method == "post" or method == "register":
            parser.add_argument('role_id', type=int, required=True,
                                help="Invalid or missing parameter 'role'")  # Required = True for post
        parser.add_argument('password', type=inputs.regex(self.pattern['password']), required=(
            True if method == "post" else False), help="Invalid or missing parameter 'password'")
        if method == "post":
            parser.add_argument('status', type=int, required=(True), help="Invalid or missing parameter 'status'")
        args = parser.parse_args(strict=True)
        return args


class UserController(Resource):

    def __init__(self) -> None:
        self.check_args = UserCheckArgs()
        self.user_service = UserService()

    def get(self, user_id: int):
        try:
            user = self.user_service.select_one_by_id(user_id=user_id)
            return jsonify(user.json())
        except UserIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))

    def put(self, user_id: int):
        try:
            args = self.check_args.get_user_args(method="put")
            self.user_service.update(user_id=user_id, args=args)
            return jsonify({'message': f"User '{user_id}' successfully updated."})
        except UserIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except RoleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))

    def delete(self, user_id: int):
        try:
            self.user_service.delete(user_id=user_id)
            return jsonify({'message': f"User '{user_id}' successfully deleted."})
        except UserIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class UserListController(Resource):
    def __init__(self) -> None:
        self.check_args = UserCheckArgs()
        self.user_service = UserService()

    def get(self):
        try:
            users = self.user_service.select_all()
            if users:
                return jsonify([user.json() for user in users])
            else:
                return jsonify({'message': "No users found."})
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))

    def post(self):
        try:
            args = self.check_args.get_user_args(method="post")
            new_user_id = self.user_service.insert(args=args, method="post")
            return jsonify({'message': f"User {args['email']} successfully created.", 'user_id': new_user_id})
        except UserAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except RoleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class UserPageController(Resource):
    def __init__(self) -> None:
        self.user_service = UserService()

    def get(self, page: int):
        try:
            users = self.user_service.select_per_page(page=page)
            if users:
                return jsonify({'max_pages': users['max_pages'], 'users': [user.json() for user in users['users']]})
            else:
                return jsonify({'message': "No users found."})
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class UserSearchController(Resource):
    def __init__(self) -> None:
        self.user_service = UserService()

    def get(self, page: int, search: str):
        try:
            users = self.user_service.select_by_search(
                page=page, search=search)
            if users:
                return jsonify({'max_pages': users['max_pages'], 'users': [user.json() for user in users['users']]})
            else:
                return jsonify({'message': "No users found."})
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class UserParticipatesEventController(Resource):
    def __init__(self) -> None:
        self.user_service = UserService()

    def post(self, user_id: int, event_id: int) -> None:
        try:
            self.user_service.insert_event(user_id=user_id, event_id=event_id)
            return jsonify({'message': f"User id '{user_id}' successfully participates event id '{event_id}'."})
        except UserIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except EventIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserParticipatesEventAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except EventAccessDbException as e:
            abort(http_status_code=500, message=str(e))

    def delete(self, user_id: int, event_id: int) -> None:
        try:
            self.user_service.delete_event(user_id=user_id, event_id=event_id)
            return jsonify({'message': f"User id '{user_id}' successfully leave event id '{event_id}'."})
        except UserIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserParticipatesEventNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))


class UserIsRoleController(Resource):
    def __init__(self) -> None:
        self.user_service = UserService()

    def post(self, user_id: int, role_id: int) -> None:
        try:
            self.user_service.insert_role(user_id=user_id, role_id=role_id)
            return jsonify({'message': f"User id '{user_id}' successfully added role id '{role_id}'."})
        except UserIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except RoleIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserIsRoleAlreadyExistsException as e:
            abort(http_status_code=400, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))
        except RoleAccessDbException as e:
            abort(http_status_code=500, message=str(e))

    def delete(self, user_id: int, role_id: int) -> None:
        try:
            self.user_service.delete_role(user_id=user_id, role_id=role_id)
            return jsonify({'message': f"User id '{user_id}' successfully remove role id '{role_id}'."})
        except UserIdNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserIsRoleNotFoundException as e:
            abort(http_status_code=404, message=str(e))
        except UserRoleNotEmptyException as e:
            abort(http_status_code=400, message=str(e))
        except UserAccessDbException as e:
            abort(http_status_code=500, message=str(e))
