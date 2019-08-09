FROM vikaspogu/puppeteer-docker

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

WORKDIR /app
COPY . /app
RUN npm install
RUN npm install puppeteer
EXPOSE 8080
ENTRYPOINT ["dumb-init", "--"]
CMD npm start