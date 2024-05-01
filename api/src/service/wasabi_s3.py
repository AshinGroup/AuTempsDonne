import boto3
import os
from datetime import datetime

class WasabiS3:
    def connect_s3(self):
        s3 = boto3.client('s3',
                        endpoint_url=os.getenv('WASABI_ENDPOINT'),
                        aws_access_key_id=os.getenv('WASABI_ACCESS_KEY'),                           
                        aws_secret_access_key=os.getenv('WASABI_SECRET_KEY'))
        return s3
    
        


    # def get_map(self, delivery_id: int):
    #     s3 = self.connect_s3()
    #     bucket_name = os.getenv('WASABI_BUCKET_NAME') # A changer avec le .env
    #     print(bucket_name)
    #     file_path = "roadmap_delivery_1.html"
        
    #     key_name = "roadmap_delivery_1.html"
    #     f = open("myfile.html", "w")
    #     f.write(s3.get_object(Bucket=bucket_name, Key=key_name)['Body'].read().decode('utf-8'))
    #     return
    

    
    def upload_file(self, folder:str, file_path: str):
        bucket = os.getenv('WASABI_BUCKET_NAME')
        time = datetime.now()
        formatted_time = time.strftime('%Y-%m-%d_%H_%M_%f')
        key = f"{folder}/qr-code_{formatted_time}.png"
        s3 = self.connect_s3()
        with open(file_path, "rb") as f:
            file_data = f.read()
        s3.put_object(Body=file_data, Bucket=bucket, Key=key)
        print("File uploaded successfully.")
        return key