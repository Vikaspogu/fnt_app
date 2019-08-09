FROM vikaspogu/puppeteer-docker
COPY image_scraper/* .
RUN ls

RUN npm install
RUN npm install puppeteer
RUN ls /app/
EXPOSE 8080
CMD npm start