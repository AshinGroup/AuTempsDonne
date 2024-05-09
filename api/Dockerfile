FROM python:3.10

RUN apt-get update && \
    apt-get install -y wget && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    CHROME_DRIVER_VERSION=`curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE` && \
    wget -q -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip && \
    unzip /tmp/chromedriver.zip -d /usr/bin && \
    chmod +x /usr/bin/chromedriver && \
    rm /tmp/chromedriver.zip


WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r src/requirements.txt

EXPOSE ${FLASK_PORT}

ENTRYPOINT ["python3", "src/server.py"]