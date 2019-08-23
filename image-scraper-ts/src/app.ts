import * as express from 'express';
import cors from 'cors';
import * as bodyParser from "body-parser";
import {Scraper} from "./routes/scraper";

class App {

    public app: express.Application;
    public scraperRoute: Scraper = new Scraper();

    constructor() {
        this.app = express();
        this.config();
        this.scraperRoute.routes(this.app);
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
    }
}

export default new App().app;
