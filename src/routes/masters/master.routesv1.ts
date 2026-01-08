import express, { Request, Response } from 'express';
// Update the import path if the file is named 'shared.module.ts' and located in 'src/shared/'
import { BaseRoute, StatusCodes, Phrases } from '../../shared/shared.module'; //CommonHelper
// import multer from 'multer';
import dotenv from 'dotenv';
// import { requestController } from '../controllers/features/request.controller' ;
// import {logsController} from '../controllers/logs/logs.controllers';

// import { DashboardController } from '../controllers/features/dashboard.controoler';

export class ApiRoutes extends BaseRoute {

    // private timestamp = Date.now();
    // private tempDestination;
    // private fileUploader;

    public router = express.Router();
    // private commonHelper: CommonHelper;

   
        constructor() {
        super();
        // this.tempDestination = process.env.TEMP_PATH + '/' + this.timestamp;
        dotenv.config();
        // this.initializeStorage();
        this.initiateRoutes();

        // this.commonHelper = new CommonHelper();
    }

   
    protected initiateRoutes = () => {
        this.getRoute().get("/", (req: Request, res: Response): Response | any => {
            return res.status(StatusCodes.SUCCESS).json({ response: { data: null, error: '', status: StatusCodes.SUCCESS, message: Phrases.APIROUTE } });
        });
    }
}