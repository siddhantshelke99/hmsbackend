import express from 'express';
import { BaseRoute } from '../../shared/shared.module'; 
import { OpdController } from '../../controllers/features/opd-controller';

// 1. Rename class to OpdRoutes
export class OpdRoutes extends BaseRoute {

    public router = express.Router();
    private opdController: OpdController = new OpdController();

    constructor() {
        super();
        this.initiateRoutes();
    }

    protected initiateRoutes = () => {
      
        this.getRoute().get("/opd/get-opd-records", this.opdController.getOpdInfo);
        this.getRoute().post("/opd/create-opd-record", this.opdController.createOpdRecord);
        this.getRoute().put("/opd/update-opd-record/:id", this.opdController.updateOpdRecord);
        this.getRoute().delete("/opd/delete-opd-record/:id", this.opdController.deleteOpdRecord);
        this.getRoute().get("/opd/get-opd-record/:id", this.opdController.getPatientById);
    }   
}