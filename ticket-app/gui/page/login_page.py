from PyQt5.QtWidgets import QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout
from PyQt5.QtCore import pyqtSignal, Qt
from PyQt5.QtGui import QPixmap

import keyring
import re

from api.client import APIClient
from gui.utils import show_popup


class LoginPage(QWidget):
    # Signal emitted when the user successfully logs in
    loginSuccess = pyqtSignal()

    def __init__(self, parent=None):
        # Initialize the widget
        super().__init__(parent)
        self.api_client = APIClient()
        main_layout = QVBoxLayout(self)

        # Setup Logo Typo
        self.loginImage = QLabel(self)
        self.loginImage.setObjectName("loginImage")
        pixmap = QPixmap("ressources/atd_logo_typo.png").scaled(300,
                                                                300, Qt.KeepAspectRatio, Qt.SmoothTransformation)
        self.loginImage.setPixmap(pixmap)
        self.loginImage.setAlignment(Qt.AlignCenter)

        # Setup Footer
        self.loginFooter = QLabel(
            "This application is only reserved to administrators")
        self.loginFooter.setObjectName("loginFooter")
        self.loginFooter.setAlignment(Qt.AlignCenter)

        # Setup Form
        form_layout = QVBoxLayout()

        self.emailLabel = QLabel("Email:")
        self.emailInput = QLineEdit()

        self.passwordLabel = QLabel("Password:")
        self.passwordInput = QLineEdit()
        self.passwordInput.setEchoMode(QLineEdit.Password)

        self.loginButton = QPushButton("Login")
        self.loginButton.clicked.connect(self.attempt_login)

        # Add widgets to the form layout
        form_layout.addWidget(self.emailLabel)
        form_layout.addWidget(self.emailInput)
        form_layout.addWidget(self.passwordLabel)
        form_layout.addWidget(self.passwordInput)
        form_layout.addWidget(self.loginButton)

        # Add Logo Widget to the main layout
        main_layout.addWidget(self.loginImage)
        # Add Form Widget to the main layout
        main_layout.addLayout(form_layout)
        # Add Footer Widget to the main layout
        main_layout.addWidget(self.loginFooter)

        self.setLayout(main_layout)

    # Resize the widget to fit the parent widget
    def resizeEvent(self, event):
        parent_size = self.parent().size() if self.parent() else self.size()
        new_width = parent_size.width() // 3
        new_height = self.sizeHint().height()
        new_x = (parent_size.width() - new_width) // 2
        new_y = (parent_size.height() * 2 // 2 - new_height) // 3
        self.setGeometry(new_x, new_y, new_width, new_height)
        super().resizeEvent(event)

    # Attempt to login the user
    def attempt_login(self):
        if self.validate_email(self.emailInput.text()):
            response = self.api_client.login(
                self.emailInput.text(), self.passwordInput.text())
            if response:
                # Check if the user is an admin
                if response['role_id'] != 1:
                    show_popup(self, "Login Error",
                               "The logged account don't have the rights for administration.")
                else:
                    keyring.set_password(
                        "ATD", "access_token", response['access_token'])
                    keyring.set_password(
                        "ATD", "refresh_token", response['refresh_token'])
                    keyring.set_password(
                        "ATD", "user_id", str(response['user_id']))
                    self.loginSuccess.emit()
            else:
                show_popup(
                    self, "Login Error", "Invalid email or password, if it persist, contact a dev.")
        else:
            show_popup(self, "Login Error", "Invalid email format.")

    # Validate email format
    def validate_email(self, email):
        if re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return True
        return False
