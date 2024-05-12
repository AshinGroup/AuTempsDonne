from PyQt5.QtCore import QSize, pyqtSignal
from PyQt5.QtGui import QIcon, QPixmap
from PyQt5.QtWidgets import QDialog, QLabel, QMessageBox, QPushButton, QVBoxLayout, QAction, QToolBar


# display a popup message -> ok button

def show_popup(parent, title, message):
    msg = QMessageBox(parent)
    msg.setWindowTitle(title)
    msg.setText(message)
    msg.setStandardButtons(QMessageBox.Ok)
    msg.exec_()

# display a popup message -> ask for confirmation


def show_confirmation_dialog(message):
    dialog = QMessageBox()
    dialog.setWindowTitle("Confirmation")
    dialog.setWindowIcon(QIcon("ressources/atd_logo_.png"))
    dialog.setText(message)
    dialog.setIcon(QMessageBox.Question)
    dialog.setStandardButtons(QMessageBox.Yes | QMessageBox.No)
    dialog.setDefaultButton(QMessageBox.No)
    dialog.buttonClicked.connect(dialog.deleteLater)
    reply = dialog.exec_()
    return reply == QMessageBox.Yes

# display a popup message -> ask for status selection


def show_status_selection_dialog(current_status):
    # Create a dialog
    dialog = QDialog()
    dialog.setWindowTitle("Select Status")
    dialog.setWindowIcon(QIcon("ressources/atd_logo_.png"))

    layout = QVBoxLayout()
    dialog.setLayout(layout)

    # Create the label
    label = QLabel("Choose the status for the ticket:")
    layout.addWidget(label)

    # Create buttons based on the current status
    new_button = QPushButton("New")
    in_progress_button = QPushButton("In Progress")
    closed_button = QPushButton("Closed")

    # Set icons
    new_button.setIcon(
        QIcon(QPixmap("ressources/ticket_green_.png")))
    in_progress_button.setIcon(
        QIcon(QPixmap("ressources/ticket_orange_.png")))
    closed_button.setIcon(
        QIcon(QPixmap("ressources/ticket_red_.png")))

    # Add buttons to dialog except the current status
    if current_status != "New":
        layout.addWidget(new_button)
    if current_status != "In Progress":
        layout.addWidget(in_progress_button)
    if current_status != "Closed":
        layout.addWidget(closed_button)

    # Assign signals to buttons
    new_button.clicked.connect(lambda: dialog.done(3))
    in_progress_button.clicked.connect(lambda: dialog.done(1))
    closed_button.clicked.connect(lambda: dialog.done(2))

    dialog.exec_()
    result = dialog.result()

    # Return the selected status
    if result == 3:
        return 0
    elif result == 1:
        return 1
    elif result == 2:
        return 2
    else:
        return -1


class Navbar(QToolBar):
    # Define signals for each button click event
    dashboardClicked = pyqtSignal()
    ticketsClicked = pyqtSignal()
    myTicketsClicked = pyqtSignal()
    logoutClicked = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setIconSize(QSize(32, 32))
        self.setup_actions()

    def setup_actions(self):
        # Dashboard
        dashboard_action = QAction(
            QIcon('ressources/dashboard_.png'), 'Dashboard', self)
        dashboard_action.triggered.connect(self.dashboardClicked.emit)
        self.addAction(dashboard_action)

        # Tickets
        tickets_action = QAction(
            QIcon('ressources/totalTickets_.png'), 'Tickets', self)
        tickets_action.triggered.connect(self.ticketsClicked.emit)
        self.addAction(tickets_action)

        # My Tickets
        my_tickets_action = QAction(
            QIcon('ressources/myTickets_.png'), 'My Tickets', self)
        my_tickets_action.triggered.connect(self.myTicketsClicked.emit)
        self.addAction(my_tickets_action)

        # Logout
        logout_action = QAction(
            QIcon('ressources/logOut_.png'), 'Logout', self)
        logout_action.triggered.connect(self.logoutClicked.emit)
        self.addAction(logout_action)
