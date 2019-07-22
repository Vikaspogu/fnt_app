const express = require("express");
const cors = require('cors')
const puppeteer = require("puppeteer");
const delay = require("delay");
const app = express();
const url = require("url");
const querystring = require("querystring");
const port = process.env.PORT || 3000;

app.use(cors())

app.get("/scrape/:keyword", async (req, res) => {
  try {
    var keyword = req.params.keyword;
    var uri = await imageExtract(keyword);
    console.log("Scraping image for " + keyword + " " + uri);
    res.send(uri);
  } catch (error) {
    console.log(error);
  }
});

app.get("/", async (req, res) => {
  res.send({
    ping: "pong"
  });
});

async function imageExtract(imageName) {
  try {
    // open the headless browser
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    // open a new page
    const page = await browser.newPage();
    // enter url in page
    await page.goto(`https://www.google.com/search?q=${imageName} logo&source=lnms&tbm=isch&sa=X`);
    await delay(1000);
    await page.waitForSelector("#search a");
    const stories = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("#search a"));
      return links.map(link => link.href);
    });
    const imgs = await stories.map(link => querystring.parse(url.parse(link).query).imgurl).filter(img => img);
    await browser.close();
    return await Promise.resolve(imgs[0]);
  } catch (err) {
    // Catch and display errors
    console.log(err);
    await browser.close();
  }
}

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
