from PyQt5.QtWidgets import QApplication
from gui.main_window import MainWindow
import sys
import os

# credit to https://youtu.be/p3tSLatmGvU?si=hNuDxs97sEXfRxuA and https://stackoverflow.com/questions/7674790/bundling-data-files-with-pyinstaller-onefile
# for the resource_path function and build process

# https://drive.google.com/file/d/10l93g29zoJEKSXVgbwPq_uozn6QpZiHJ/view?usp=sharing


def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS2
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


def main():
    app = QApplication(sys.argv)
    with open(resource_path('gui\\style.css'), 'r') as f:
        style = f.read()
        app.setStyleSheet(style)
    mainWindow = MainWindow()
    mainWindow.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
