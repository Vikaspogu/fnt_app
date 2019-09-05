import {Request, Response} from 'express';
import * as puppeteer from 'puppeteer';
import delay from 'delay';
import * as querystring from "querystring";
import * as url from "url";

export class Scraper {
    public routes(app): void { //received the express instance from app.ts file
        app.route('/scrape/:keyword').get((req: Request, res: Response) => {
            const keyword = req.params.keyword;
            const uri = this.extractImage(keyword);
            uri.then(result => {
                res.status(200).send({uri: result})
            });
        });
        app.route('/').get((req: Request, res: Response) => {
            res.status(200).send({
                "ping": "pong"
            });
        });
    }

    private async extractImage(keyword: string): Promise<string>{
        return new Promise<string>(async (resolve, reject) => {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            // open a new page
            const page = await browser.newPage();
            // enter url in page
            await page.goto(`https://www.google.com/search?q=${keyword} logo&source=lnms&tbm=isch&sa=X`);
            await delay(1000);
            await page.waitForSelector("#search a");
            const stories = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll("#search a"));
                return links.map(link => link.getAttribute('href'));
            });
            const filterLinks = stories.filter(link => link != null);
            const images = filterLinks.map(link => querystring.parse(url.parse(link).query).imgurl).filter(img => img);
            const filterImages = images.filter(img => img.includes('.jpg'));
            await browser.close();
            resolve(filterImages[0].toString());
        });
    }
}
