
import express from "express";
import { createServer } from "http";
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser'
import cors from 'cors';

import { ApiRoutes } from './routes/index';
import { _request, _response } from "./interfaces/http.interface";

dotenv.config();

export class Server {

    private httpServer: any;
    private app: any;
    private apiRoutes: ApiRoutes;
    private readonly DEFAULT_PORT = parseInt(process.env.PORT) || 5000;

    constructor() {
        this.apiRoutes = new ApiRoutes();
        this.initialize();
    }

    private initialize = (): void => {
        this.app = express();
        this.httpServer = createServer(this.app);


        this.configureCors();
        this.configureParser();
        this.configureRoutes();
    }


     

    private configureCors = (): void => {
        this.app.use(cors());
    }

   

    private configureParser() {
        this.app.use(bodyParser.json({ limit: '1024mb' }))
        this.app.use(bodyParser.urlencoded({ limit: '1024mb', extended: true }))
    }

    private configureRoutes = (): void => {
        this.app.get("/", (req: _request, res: _response) => {
            return res.status(200).json({ status: 'success', message: 'Application is Running' });
        });
        this.app.use("/api", this.apiRoutes.router);
    }

    public listen = (): void => {

        this.httpServer.listen(this.DEFAULT_PORT, () => {
            console.log(`Server is listening on http://localhost:${this.DEFAULT_PORT}`);
        });
    }
}

