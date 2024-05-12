from PyQt5.QtWidgets import QMainWindow, QWidget, QHBoxLayout, QVBoxLayout, QLabel
from PyQt5.QtGui import QFont, QPixmap
from PyQt5.QtCore import Qt, pyqtSignal

from api.client import APIClient
from gui.utils import show_popup


class DashboardPage(QMainWindow):
    unauthorizedSignal = pyqtSignal()

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        # Set window central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        mainLayout = QHBoxLayout(central_widget)

        # Create left and right layouts for ticket cards
        self.leftLayout = QVBoxLayout()
        self.rightLayout = QVBoxLayout()

        # Create instances of TicketCard with static images and labels
        ticket_card_data = [
            ("ressources/totalTickets_.png", "Total Tickets"),
            ("ressources/activeTickets_.png", "Active Tickets"),
            ("ressources/closedTickets_.png", "Closed Tickets"),
            ("ressources/myTickets_.png", "My Tickets"),
            ("ressources/myActiveTickets_.png", "My Active Tickets"),
            ("ressources/myClosedTickets_.png", "My Closed Tickets")
        ]

        # Create TicketCard instances and add them to the layouts with init at 0
        for icon, title in ticket_card_data[:3]:
            card = TicketCard(icon, title, 0)
            self.leftLayout.addWidget(card)
        for icon, title in ticket_card_data[3:]:
            card = TicketCard(icon, title, 0)
            self.rightLayout.addWidget(card)

        # Add left and right layouts to main layout
        mainLayout.addLayout(self.leftLayout)
        mainLayout.addLayout(self.rightLayout)

    def fetch_and_display_data(self):
        # Fetch ticket data from API
        api_client = APIClient()
        ticket_counts = api_client.fetch_ticket_dashboard()

        # Handle unauthorized access
        if ticket_counts == "401":
            show_popup(self, "Unauthorized Access",
                       "There was an issue with your credentials. Please login again.")
            self.unauthorizedSignal.emit()
            return

        # Update the count on the existing TicketCard instances
        if ticket_counts:
            for i, count in enumerate(ticket_counts):
                if i < 3:
                    self.leftLayout.itemAt(i).widget().set_count(count)
                else:
                    self.rightLayout.itemAt(i - 3).widget().set_count(count)

    def showEvent(self, event):
        # Fetch and display data when the page is shown
        self.fetch_and_display_data()
        super().showEvent(event)


# Create widget for ticket card
class TicketCard(QWidget):
    def __init__(self, icon_path, title, count, parent=None):
        super().__init__(parent)
        self.setupUI(icon_path, title, count)

    def setupUI(self, icon_path, title, count):
        # Set fixed size and layout
        self.setFixedSize(200, 120)
        layout = QVBoxLayout(self)

        # Add image label
        iconLabel = QLabel()
        pixmap = QPixmap(icon_path)
        iconLabel.setPixmap(pixmap.scaled(
            60, 60, Qt.KeepAspectRatio, Qt.SmoothTransformation))
        iconLabel.setAlignment(Qt.AlignCenter)
        layout.addWidget(iconLabel)

        # Add title label
        titleLabel = QLabel(title)
        titleLabel.setFont(QFont("Arial", 14))
        titleLabel.setAlignment(Qt.AlignCenter)
        layout.addWidget(titleLabel)

        # Create and store the count label
        self.count_label = QLabel(str(count))
        self.count_label.setFont(QFont("Arial", 18, QFont.Bold))
        self.count_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.count_label)

    def set_count(self, count):
        self.count_label.setText(str(count))
