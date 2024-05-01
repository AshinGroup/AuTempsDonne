import qrcode
from urllib.parse import urlencode
import os
from service.wasabi_s3 import WasabiS3

class QrCodeService:
    def __init__(self) -> None:
        self.wasabi_s3_service = WasabiS3()

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
        
        img.save("tmp/qrcode.png")

    def delete_qrcode(self):
        os.remove("tmp/qrcode.png")


    def generate_qrcode(self, data: dict):
        print(data)
        self.create_qrcode(data)
        key = self.wasabi_s3_service.upload_file(folder="qrcode", file_path="tmp/qrcode.png",)
        self.delete_qrcode()
        src = f"{os.getenv('WASABI_ENDPOINT')}/{os.getenv('WASABI_BUCKET_NAME')}/{key}"
        return src

# a = QrCodeService()
# a.create_qrcode({"hey": "1"})
# a.wasabi_s3_service.upload_file(folder="qrcode", file_path="api/tmp/qrcode.png",)
# a.delete_qrcode()