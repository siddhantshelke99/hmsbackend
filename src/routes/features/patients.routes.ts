import express from 'express';
import { BaseRoute } from '../../shared/shared.module';
import { PatientsController, patientUploadMiddleware } from '../../controllers/features/patients.controller';
export class PatientsRoutes extends BaseRoute {
    public router = express.Router();
    private patientsController: PatientsController = new PatientsController()
    constructor() {
        super();
        this.initiateRoutes();
    }
    protected initiateRoutes = () => {
        this.getRoute().post("/patients/register", patientUploadMiddleware, (req, res) => {
            this.patientsController.registerPatient(req, res);
        });
        this.getRoute().get("/patients/get-all-patients", this.patientsController.getAllPatients);
        this.getRoute().get("/patients/getPatientById/:patientId", this.patientsController.getPatientById);



        
    }
}