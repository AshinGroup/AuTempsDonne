FROM python:3.10

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

EXPOSE 6001

ENTRYPOINT ["python3","/app/server.py"]