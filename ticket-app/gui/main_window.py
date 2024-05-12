from PyQt5.QtWidgets import QMainWindow, QStackedWidget, QVBoxLayout, QWidget
from PyQt5.QtGui import QIcon

import keyring

from gui.utils import Navbar
from gui.page.login_page import LoginPage
from gui.page.dashboard_page import DashboardPage
from gui.page.tickets_page import TicketsPage
from gui.page.my_tickets_page import MyTicketsPage


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Au temps donnée")
        self.setWindowIcon(QIcon('ressources/atd_logo_.ico'))
        self.setGeometry(100, 100, 1080, 720)

        self.stackedWidget = QStackedWidget()

        self.centralWidget = QWidget()
        self.centralLayout = QVBoxLayout(self.centralWidget)
        self.centralLayout.addWidget(self.stackedWidget)

        self.setCentralWidget(self.centralWidget)

        # Initialize Pages
        self.loginPage = LoginPage()
        self.dashboardPage = DashboardPage()
        self.ticketsPage = TicketsPage()
        self.myTicketsPage = MyTicketsPage()

        # Add login page to the stacked widget
        self.stackedWidget.addWidget(self.loginPage)

        # Connect Signals
        self.loginPage.loginSuccess.connect(self.show_dashboard)
        # Logout Signals for API calls
        self.dashboardPage.unauthorizedSignal.connect(self.logout)
        self.ticketsPage.unauthorizedSignal.connect(self.logout)
        self.myTicketsPage.unauthorizedSignal.connect(self.logout)

    def show_dashboard(self):
        # Remove existing navbar if it exists
        for i in range(self.centralLayout.count()):
            widget = self.centralLayout.itemAt(i).widget()
            if isinstance(widget, Navbar):
                widget.deleteLater()

        # Add the navbar only after successful login
        self.navbar = Navbar()
        self.centralLayout.insertWidget(
            0, self.navbar)  # Add navbar at the top
        self.stackedWidget.addWidget(self.dashboardPage)
        self.stackedWidget.setCurrentWidget(self.dashboardPage)

        # Connect navbar signals after successful login
        self.navbar.dashboardClicked.connect(self.show_dashboard)
        self.navbar.ticketsClicked.connect(self.show_tickets)
        self.navbar.myTicketsClicked.connect(self.show_my_tickets)
        self.navbar.logoutClicked.connect(self.logout)

    def show_tickets(self):
        self.stackedWidget.addWidget(self.ticketsPage)
        self.stackedWidget.setCurrentWidget(self.ticketsPage)

    def show_my_tickets(self):
        self.stackedWidget.addWidget(self.myTicketsPage)
        self.stackedWidget.setCurrentWidget(self.myTicketsPage)

    def logout(self):
        # delete the navbar, remove access token and refresh token from keyring and show login page
        self.navbar.deleteLater()
        keyring.delete_password("ATD", "access_token")
        keyring.delete_password("ATD", "refresh_token")
        self.stackedWidget.setCurrentWidget(self.loginPage)
