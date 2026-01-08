import express from 'express';
import { BaseRoute } from '../../shared/shared.module'; 
import { DepartmentController } from '../../controllers/masters/department.controller';
// 1. Rename class to DepartmentRoutes
export class DepartmentRoutes extends BaseRoute {

    public router = express.Router();
    private departmentController: DepartmentController = new DepartmentController();
    constructor() {
        super();
        this.initiateRoutes();
    }

    protected initiateRoutes = () => {
      
        this.getRoute().get("/department/get-departments", this.departmentController.getDepartments);
        this.getRoute().post("/department/save-department", this.departmentController.createDepartment);
        // this.getRoute().put("/opd/update-opd-record/:id", this.opdController.updateOpdRecord);
        // this.getRoute().delete("/opd/delete-opd-record/:id", this.opdController.deleteOpdRecord);
        // this.getRoute().get("/opd/get-opd-record/:id", this.opdController.getPatientById);
    }   
}