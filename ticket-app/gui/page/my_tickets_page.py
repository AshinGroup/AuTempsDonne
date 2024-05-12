from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton, QTableWidget, QTableWidgetItem, QDialog, QDialogButtonBox, QTextEdit, QMessageBox, QHBoxLayout, QWidget, QAbstractItemView
from PyQt5.QtCore import Qt, QSize, pyqtSignal
from PyQt5.QtGui import QIcon, QColor

import keyring

from api.client import APIClient
from gui.utils import show_confirmation_dialog, show_popup, show_status_selection_dialog

# Add a dialog to display ticket details


class TicketDetailsDialog(QDialog):
    def __init__(self, ticket, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Ticket Details")

        layout = QVBoxLayout(self)

        # Add labels for subject, type, and description
        layout.addWidget(QLabel(f"Subject: {ticket['subject']}"))
        layout.addWidget(QLabel(f"Type: {self.get_type_text(ticket['type'])}"))
        layout.addWidget(QLabel("Description:"))

        # Add text edit widget for description
        description_text = QTextEdit()
        description_text.setPlainText(ticket['description'])
        description_text.setReadOnly(True)
        layout.addWidget(description_text)

        # Add OK button
        button_box = QDialogButtonBox(QDialogButtonBox.Ok)
        button_box.accepted.connect(self.accept)
        layout.addWidget(button_box)

    def get_type_text(self, type):
        types = {
            0: "Select a request type",
            1: "Account Recovery",
            2: "Technical Issues",
            3: "Account Management",
            4: "Feedback or Suggestions",
            5: "Billing or Payment Issue",
            6: "Feature Request",
            7: "Other"
        }
        return types.get(type, "Unknown")


class MyTicketsPage(QWidget):
    # Signal emitted when the user is unauthorized
    unauthorizedSignal = pyqtSignal()

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.layout = QVBoxLayout(self)
        self.table = QTableWidget()
        self.layout.addWidget(self.table)

    def showEvent(self, event):
        self.fetch_and_display_tickets()
        super().showEvent(event)

    def fetch_and_display_tickets(self):
        # Call the API to fetch tickets
        api_client = APIClient()
        response = api_client.fetch_my_ticket()

        if response:
            if response == "401":
                show_popup(self, "Unauthorized Access",
                           "There was an issue with your credentials. Please login again.")
                self.unauthorizedSignal.emit()
                return
            tickets = response["tickets"]
        else:
            show_popup(self, "Error",
                       "An error occurred while fetching my tickets, contact a dev to check the server.")

        # Filter tickets where admin ID is equal to user ID
        user_id = keyring.get_password("ATD", "user_id")
        user_tickets = [ticket for ticket in tickets if ticket.get(
            'admin') and ticket['admin'].get('id') == int(user_id)]

        # Set up the table
        self.table.setRowCount(len(user_tickets))
        self.table.setColumnCount(6)
        self.table.setHorizontalHeaderLabels(
            ["ID", "Subject", "Status", "Issue", "Author", "Actions"])

        # Disable editing of cells and vertical Header
        # self.table.setShowGrid(False)
        self.table.verticalHeader().setVisible(False)
        self.table.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.table.setSelectionMode(QAbstractItemView.NoSelection)

        # Set column widths
        self.table.setColumnWidth(0, 40)   # ID column width
        self.table.setColumnWidth(1, 170)  # Subject column width
        self.table.setColumnWidth(2, 120)  # Status column width
        self.table.setColumnWidth(3, 180)  # Type column width
        self.table.setColumnWidth(4, 200)  # Author column width
        self.table.setColumnWidth(5, 150)  # Actions column width

        # Populate the table with ticket data
        for row, ticket in enumerate(user_tickets):
            self.table.setItem(row, 0, QTableWidgetItem(str(ticket['id'])))
            self.table.setItem(row, 1, QTableWidgetItem(ticket['subject']))
            self.table.setItem(row, 2, QTableWidgetItem(
                self.get_status_text(ticket['status'])))
            self.table.setItem(row, 3, QTableWidgetItem(
                self.get_type_text(ticket['type'])))
            self.table.setItem(row, 4, QTableWidgetItem(
                ticket['author']['email']))

            # Set text color for Status column
            status_item = QTableWidgetItem(
                self.get_status_text(ticket['status']))
            if ticket['status'] == 0:  # New
                status_item.setData(Qt.TextColorRole, QColor('green'))
            elif ticket['status'] == 1:  # In Progress
                status_item.setData(Qt.TextColorRole, QColor('orange'))
            elif ticket['status'] == 2:  # Closed
                status_item.setData(Qt.TextColorRole, QColor('red'))
            self.table.setItem(row, 2, status_item)

            # Create a container widget for action buttons
            actions_widget = QWidget()
            actions_layout = QHBoxLayout(actions_widget)
            actions_layout.setContentsMargins(0, 0, 0, 0)
            actions_layout.setSpacing(0)

            # Add a button to view ticket details
            view_button = QPushButton()
            view_button.setObjectName("viewButton")
            view_button.setIcon(QIcon("ressources/view_.png"))
            view_button.setIconSize(QSize(18, 18))
            view_button.setFixedSize(25, 25)
            view_button.clicked.connect(
                self.view_details(ticket))
            actions_layout.addWidget(view_button)

            # Add change status button
            status_button = QPushButton()
            status_button.setObjectName("statusButton")
            status_button.setIcon(QIcon("ressources/ticket_.png"))
            status_button.setIconSize(QSize(18, 18))
            status_button.setFixedSize(25, 25)
            status_button.clicked.connect(
                lambda _, row=row: self.change_ticket_status(row))
            actions_layout.addWidget(status_button)

            # Add unassign button
            unassign_button = QPushButton()
            unassign_button.setObjectName("unassignButton")
            unassign_button.setIcon(QIcon("ressources/remove_.png"))
            unassign_button.setIconSize(QSize(18, 18))
            unassign_button.setFixedSize(25, 25)
            unassign_button.clicked.connect(
                lambda _, row=row: self.unassign_to_me(row))
            actions_layout.addWidget(unassign_button)

            actions_widget.setLayout(actions_layout)
            self.table.setCellWidget(row, 5, actions_widget)

    def get_status_text(self, status):
        if status == 0:
            return "New"
        elif status == 1:
            return "In Progress"
        elif status == 2:
            return "Closed"
        else:
            return "Unknown"

    def get_type_text(self, type):
        types = {
            0: "Select a request type",
            1: "Account Recovery",
            2: "Technical Issues",
            3: "Account Management",
            4: "Feedback or Suggestions",
            5: "Billing or Payment Issue",
            6: "Feature Request",
            7: "Other"
        }
        return types.get(type, "Unknown")

    def view_details(self, ticket):
        def show_dialog():
            dialog = TicketDetailsDialog(ticket, self)
            dialog.exec_()

        return show_dialog

    def unassign_to_me(self, row):
        # Get the ticket ID from the selected row
        ticket_item = self.table.item(row, 0)
        if ticket_item is None:
            show_popup(self, "Error", "No ticket selected")
            return
        selected_ticket_id = ticket_item.text()

        # Show confirmation dialog
        confirmed = show_confirmation_dialog(
            "Do you want to remove this ticket from your management ?")

        if confirmed:
            api_client = APIClient()
            status_code = api_client.unassign_ticket(selected_ticket_id)
            if status_code == 200:
                self.fetch_and_display_tickets()
            elif status_code == 401:
                show_popup(self, "Unauthorized Access",
                           "There was an issue with your credentials. Please login again.")
                self.unauthorizedSignal.emit()
                return
            else:
                show_popup(self, "Error",
                           "An error occurred while unassigned the ticket, contact a dev to check the server.")

    def change_ticket_status(self, row):
        # Get the ticket ID from the selected row
        ticket_item = self.table.item(row, 0)
        if ticket_item is None:
            show_popup(self, "Error", "No ticket selected")
            return
        selected_ticket_id = ticket_item.text()

        # Get the ticket status from the selected row
        status_item = self.table.item(row, 2)
        if status_item is None:
            show_popup(self, "Error", "No status selected")
            return

        current_status = status_item.text()

        # Show status selection dialog with the current status in parameter
        selected_status = show_status_selection_dialog(current_status)
        if selected_status != -1:
            api_client = APIClient()
            status_code = api_client.change_status_ticket(
                selected_ticket_id, selected_status)
            if status_code == 200:
                self.fetch_and_display_tickets()
            elif status_code == 401:
                show_popup(self, "Unauthorized Access",
                           "There was an issue with your credentials. Please login again.")
                self.unauthorizedSignal.emit()
                return
            else:
                # Handle other errors, perhaps show an error message
                show_popup(self, "Error",
                           "An error occurred while changing the status of the ticket, contact a dev to check the server.")
