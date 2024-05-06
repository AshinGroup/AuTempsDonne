import os
from fpdf import FPDF
from service.wasabi_s3 import WasabiS3

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Summary', 0, 1, 'C')  
        self.ln(10)  

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, 'Page %s' % self.page_no(), 0, 0, 'C')


class PdfService:
    def __init__(self) -> None:
        self.wasabi_service = WasabiS3()

    def generate_roadmap_pdf(self, time: str, distance: float, distance_units: str, locations: list, type: str): 
        pdf = PDF()
        pdf.add_page()

        pdf.image('tmp/map.png', x=10, y=20, w=180)

        pdf.set_font('Arial', '', 12)
        pdf.ln(100)  
        pdf.cell(0, 10, f"Estimated total time : {time}", 0, 1)
        pdf.cell(0, 10, f"Estimated total distance : {distance} {distance_units}", 0, 1)
        pdf.ln(10)
        pdf.set_draw_color(0, 0, 0) 
        pdf.set_fill_color(255, 255, 255)  
        pdf.set_line_width(0.5) 
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())  
        pdf.ln(10)

        for i in range(len(locations)):
            if i == 0:
                txt = f"Starting Point : {locations[i].description}"
            else:
                txt = f"Location {i} : {locations[i].description}"
            pdf.multi_cell(0, 10, txt, 0, 1)
            pdf.ln(5)
      
        if not os.path.exists("tmp"):
            os.makedirs("tmp")
        pdf.output('tmp/roadmap.pdf')
        pdf_src = self.wasabi_service.upload_file(folder=f"pdf/{type}", file_path="tmp/roadmap.pdf", type=f"{type}_roadmap", extension="pdf")

        if os.path.exists('tmp/roadmap.pdf'):
            os.remove('tmp/roadmap.pdf')

        if os.path.exists('tmp/map.png'):
            os.remove('tmp/map.png')

        return pdf_src
    

    def generate_demand_pdf(self, data: dict, shop_details: dict): 
        pdf = PDF()
        pdf.add_page()

        pdf.image('tmp/qrcode.png', x=10, y=20, w=100)

        pdf.set_font('Arial', '', 12)
        pdf.ln(90)  
        pdf.cell(0, 10, f"Shop Name : {shop_details['name']}", 0, 1)
        pdf.multi_cell(0, 10, f"Location : {shop_details['location']}", 0, 1)
        pdf.ln(10)
        pdf.set_draw_color(0, 0, 0) 
        pdf.set_fill_color(255, 255, 255)  
        pdf.set_line_width(0.5) 
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())  
        pdf.ln(10)
        for i in range(len(data['packages'])):
            txt = f"Package {i+1} : {data['packages'][i]}"
            pdf.multi_cell(0, 10, txt, 0, 1)
            pdf.ln(5)
      
        if not os.path.exists("tmp"):
            os.makedirs("tmp")
        pdf.output('tmp/demand.pdf')
        pdf_src = self.wasabi_service.upload_file(folder=f"pdf/demand", file_path="tmp/demand.pdf", type=f"demand", extension="pdf")

        if os.path.exists('tmp/demand.pdf'):
            os.remove('tmp/demand.pdf')

        if os.path.exists('tmp/qrcode.png'):
            os.remove('tmp/qrcode.png')

        return pdf_src
    
    

