FROM vikaspogu/puppeteer-docker
#Copy from image_scraper folder for buildah tekton task, for regular builds change it to `.`
COPY image_scraper/* .
RUN npm install
RUN npm install puppeteer
EXPOSE 8080
CMD npm start