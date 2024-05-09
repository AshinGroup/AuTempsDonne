import qrcode
from urllib.parse import urlencode
import os
from service.wasabi_s3 import WasabiS3
from service.pdf_file import PdfService

class QrCodeService:
    def __init__(self) -> None:
        self.wasabi_s3_service = WasabiS3()
        self.pdf_service = PdfService()

    def create_qrcode(self, data: dict):
        query = urlencode(data)

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(query)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        if not os.path.exists("tmp"):
            os.makedirs("tmp")
        img.save("tmp/qrcode.png")


    def generate_qrcode(self, data: dict, shop_details: dict):
        print(data)
        self.create_qrcode(data)
        png_src = self.wasabi_s3_service.upload_file(folder="qrcode", file_path="tmp/qrcode.png", type="qr-code", extension="png")
        pdf_src = self.pdf_service.generate_demand_pdf(data=data, shop_details=shop_details)
        return png_src, pdf_src

