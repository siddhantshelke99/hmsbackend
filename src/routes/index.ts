import express, { Request, Response } from 'express';
import { BaseRoute, StatusCodes, Phrases } from '../shared/shared.module'; 
import dotenv from 'dotenv';
import { AuthController } from '../controllers/auth/authentication.controller';

// 1. Import your new separate route file
import { OpdRoutes } from './main/opd.routes'; 
import { DepartmentRoutes } from './masters/deparment.routes';
export class ApiRoutes extends BaseRoute {

    public router = express.Router();
    private authController: AuthController = new AuthController();
    
    // 2. Initialize the separate OpdRoutes class
    private opdRoutes: OpdRoutes = new OpdRoutes();
    private departmentRoutes: DepartmentRoutes = new DepartmentRoutes();
    constructor() {
        super();
        dotenv.config();
        this.initiateRoutes();
    }

    protected initiateRoutes = () => {
        this.getRoute().get("/", (req: Request, res: Response): Response|any => {
            return res.status(StatusCodes.SUCCESS).json({ response: { data: null, error: '', status: StatusCodes.SUCCESS, message: Phrases.APIROUTE } });
        });

        // Auth APIs 
        this.getRoute().post("/auth/authenticate", this.authController.loginAuth);

        // Mount the OPD router
        this.router.use('/', this.opdRoutes.router); 
        this.router.use('/', this.departmentRoutes.router);
    }


    // private initializeStorage() {
    //     const store = multer.diskStorage({
    //         destination: (req, file, cb) => {
    //             this.commonHelper.createDirectory(process.env.TEMP_PATH, this.timestamp);
    //             cb(null, this.tempDestination);
    //         },
    //         filename: (req, file, cb) => {
    //             cb(null, file.originalname.replace(/ /g, '_'));
    //         }
    //     });
    //     this.fileUploader = multer({ storage: store });
    // }

}