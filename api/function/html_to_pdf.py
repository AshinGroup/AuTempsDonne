import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import folium
from fpdf import FPDF

def save_folium_map_as_pdf(map, filename):
    # Initialize Selenium WebDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    # Create a temporary HTML file for the Folium map
    temp_html = "temp_map.html"
    map.save(temp_html)
    
    # Open the HTML file with Selenium WebDriver
    driver.get("file://" + temp_html)
    
    # Wait for map to render
    time.sleep(5)  # Adjust the time according to your map's complexity
    
    # Capture screenshot of the map
    screenshot_path = "screenshot.png"
    driver.save_screenshot(screenshot_path)
    
    # Clean up
    driver.quit()
    
    # Convert screenshot to PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.image(screenshot_path, 0, 0, 210, 297)  # A4 size: 210x297 mm
    pdf.output(filename)

# Example usage
m = folium.Map(location=[51.5074, -0.1278], zoom_start=10)  # London coordinates
folium.Marker([51.5074, -0.1278], popup='London').add_to(m)
save_folium_map_as_pdf(m, "map.pdf")

