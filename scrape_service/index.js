const express = require("express");
const puppeteer = require("puppeteer");
const delay = require("delay");
const app = express();
const url = require("url");
const querystring = require("querystring");
const port = process.env.PORT || 3000;

app.get("/scrape/:keyword", async (req, res) => {
  var keyword = req.params.keyword;
  var uri = await imageExtract(keyword);
  res.send(uri);
});

async function imageExtract(imageName) {
  try {
    // open the headless browser
    const browser = await puppeteer.launch({ headless: true });
    // open a new page
    const page = await browser.newPage();
    // enter url in page
    page.goto(`https://www.google.com/search?q=${imageName}&tbm=isch`);
    await delay(1000);
    await page.waitForSelector("#search a");
    const stories = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("#search a"));
      return links.map(link => link.href);
    });
    const imgs = stories.map(link => querystring.parse(url.parse(link).query).imgurl).filter(img => img);
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
