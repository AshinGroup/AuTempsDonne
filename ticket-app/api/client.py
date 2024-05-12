import requests
import keyring
import json


class APIClient:
    def __init__(self):
        # Base URL
        self.base_url = "https://au-temps-donne.fr/api"

    def login(self, email, password):
        url = f"{self.base_url}/login"
        payload = {
            "email": email,
            "password": password
        }
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"An error occurred in APIClient.login function: {e}")
            return None

    def fetch_ticket_dashboard(self):
        access_token = keyring.get_password("ATD", "access_token")
        user_id = keyring.get_password("ATD", "user_id")
        headers = {"Authorization": f"Bearer {access_token}"}
        url1 = f"{self.base_url}/ticket"
        url2 = f"{self.base_url}/ticket/user/{user_id}"

        try:
            # Fetch ticket data for all tickets
            response = requests.get(url1, headers=headers)
            response.raise_for_status()
            ticket_data = response.json()

            # Check if ticket_data is a list
            if isinstance(ticket_data, list):
                # Initialize counters
                total_tickets = len(ticket_data)
                active_tickets = sum(
                    1 for ticket in ticket_data if ticket['status'] == 1)
                closed_tickets = sum(
                    1 for ticket in ticket_data if ticket['status'] == 2)
            else:
                # Handle unexpected structure
                return [0, 0, 0, 0, 0, 0]

            # Fetch ticket data for my tickets
            response = requests.get(url2, headers=headers)
            response.raise_for_status()
            ticket_data = response.json()

            # Check if ticket_data is a list
            if isinstance(ticket_data, list):
                my_tickets = sum(
                    1 for ticket in ticket_data if ticket['admin'] is not None)
                my_active_tickets = sum(
                    1 for ticket in ticket_data if ticket['status'] == 1 and ticket['admin'] is not None)
                my_closed_tickets = sum(
                    1 for ticket in ticket_data if ticket['status'] == 2 and ticket['admin'] is not None)
            else:
                # Handle unexpected structure
                return [total_tickets, active_tickets, closed_tickets, 0, 0, 0]

            return [total_tickets, active_tickets, closed_tickets, my_tickets, my_active_tickets, my_closed_tickets]
        except requests.HTTPError as e:
            if e.response.status_code == 401:
                # Clear keyring
                keyring.delete_password("ATD", "access_token")
                keyring.delete_password("ATD", "refresh_token")
                keyring.delete_password("ATD", "user_id")

                return "401"
            else:
                print(
                    f"An error occurred in APIClient.fetch_ticket_dashboard function: {e}")
            return None

    def fetch_all_ticket(self):
        url = f"{self.base_url}/ticket"
        access_token = keyring.get_password("ATD", "access_token")
        headers = {"Authorization": f"Bearer {access_token}"}

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            tickets = response.json()

            return tickets
        except requests.HTTPError as e:
            if e.response.status_code == 401:
                # Clear keyring
                keyring.delete_password("ATD", "access_token")
                keyring.delete_password("ATD", "refresh_token")
                keyring.delete_password("ATD", "user_id")

                return "401"
            else:
                print(
                    f"An error occurred in APIClient.fetch_all_ticket function: {e}")
            return None

    def fetch_my_ticket(self):
        user_id = keyring.get_password("ATD", "user_id")
        url = f"{self.base_url}/ticket/user/" + user_id

        access_token = keyring.get_password("ATD", "access_token")
        headers = {"Authorization": f"Bearer {access_token}"}

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            tickets = response.json()

            return tickets
        except requests.HTTPError as e:
            if e.response.status_code == 401:
                # Clear keyring
                keyring.delete_password("ATD", "access_token")
                keyring.delete_password("ATD", "refresh_token")
                keyring.delete_password("ATD", "user_id")

                return "401"
            else:
                print(
                    f"An error occurred in APIClient.fetch_all_ticket function: {e}")
            return None

    def asign_ticket(self, ticket_id):
        url = f"{self.base_url}/ticket/{ticket_id}"
        access_token = keyring.get_password("ATD", "access_token")
        user_id = keyring.get_password("ATD", "user_id")
        headers = {"Authorization": f"Bearer {access_token}",
                   "Content-Type": "application/json"}

        data = {
            "status": 0,
            "admin_id": user_id
        }

        try:
            response = requests.put(
                url, headers=headers, data=json.dumps(data))
            response.raise_for_status()

            return response.status_code
        except requests.HTTPError as e:
            if e.response.status_code == 401:
                # Clear keyring
                keyring.delete_password("ATD", "access_token")
                keyring.delete_password("ATD", "refresh_token")
                keyring.delete_password("ATD", "user_id")

                return 401
            else:
                print(
                    f"An error occurred in APIClient.asign_ticket function: {e}")
            return None

    def unassign_ticket(self, ticket_id):
        url = f"{self.base_url}/ticket/{ticket_id}"
        access_token = keyring.get_password("ATD", "access_token")
        headers = {"Authorization": f"Bearer {access_token}",
                   "Content-Type": "application/json"}
        data = {
            "status": 0,
            "admin_id": None
        }

        try:
            response = requests.put(
                url, headers=headers, data=json.dumps(data))
            response.raise_for_status()

            return response.status_code
        except requests.HTTPError as e:
            if e.response.status_code == 401:
                # Clear keyring
                keyring.delete_password("ATD", "access_token")
                keyring.delete_password("ATD", "refresh_token")
                keyring.delete_password("ATD", "user_id")

                return 401
            else:
                print(
                    f"An error occurred in APIClient.unassign_ticket function: {e}")
            return None

    def change_status_ticket(self, ticket_id, status_id):
        url = f"{self.base_url}/ticket/{ticket_id}"
        access_token = keyring.get_password("ATD", "access_token")
        user_id = keyring.get_password("ATD", "user_id")
        headers = {"Authorization": f"Bearer {access_token}",
                   "Content-Type": "application/json"}

        data = {
            "status": status_id if status_id else 0,
            "admin_id": user_id
        }

        try:
            response = requests.put(
                url, headers=headers, data=json.dumps(data))
            response.raise_for_status()

            return response.status_code
        except requests.HTTPError as e:
            if e.response.status_code == 401:
                # Clear keyring
                keyring.delete_password("ATD", "access_token")
                keyring.delete_password("ATD", "refresh_token")
                keyring.delete_password("ATD", "user_id")

                return 401
            else:
                print(
                    f"An error occurred in APIClient.change_status_ticket function: {e}")
            return None
