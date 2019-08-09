FROM vikaspogu/puppeteer-docker
COPY . .
RUN ls

RUN npm install
RUN npm install puppeteer
RUN ls /app/
EXPOSE 8080
CMD npm start