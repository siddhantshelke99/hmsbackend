import { _request } from 'src/interfaces/http.interface';
import { Request, Response } from 'express';
import { Department } from '../../../database/models';

export class DepartmentController {


    public createDepartment = async (req: Request, res: Response) => {
        try {
            const { deptCode, deptName, deptType, hodName, hodEmail, hodContact } = req.body;


            await Department.create({
                deptCode, deptName, deptType, hodName, hodEmail, hodContact
            });

            console.log("Department created successfully");

            res.status(201).json({ message: "Department created successfully", });
        } catch (error) {
            console.error("Error during Department Creation:", error);
            res.status(500).json({ message: "An error occurred while creating the department", error: error.message });
        }
    };
    public getDepartments = async (req: Request, res: Response) => {
        try {
            const departments = await Department.findAll({ raw: true });    
            res.status(200).json({
                status: 200,
                message: "Departments fetched successfully",
                data: departments
            });
        } catch (error) {   
            console.error("Error fetching Departments:", error);
            res.status(500).json({
                status: 500,
                message: "Failed to fetch Departments"
            });
        }   
    };  
}