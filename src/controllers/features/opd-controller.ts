import { Request, Response } from 'express';
import {OPDRegistration } from '../../../database/models';
export class OpdController {
    public getOpdInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            const opdRecords = await OPDRegistration.findAll( { raw: true } );
            res.status(200).json({
                status: 200,
                message: "OPD records fetched successfully",
                data: opdRecords
            });
        } catch (error) {   
            console.error("Error fetching OPD records:", error);
            res.status(500).json({
                status: 500,
                message: "Failed to fetch OPD records"
            });
        }
    };




    createOpdRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const { address, age, appointmentDate, department ,doctor,email,firstName,gender, lastName, phone, symptoms } = req.body;
            const newOpdRecord = await OPDRegistration.create({
                address,
                age,
                appointmentDate,
                department,
                doctor,
                email,
                firstName,
                gender,
                lastName,
                phone,
                symptoms
            });

            res.status(201).json({
                status: 201,
                message: "OPD record created successfully",
                data: newOpdRecord
            });
        } catch (error) {
            console.error("Error creating OPD record:", error);
            res.status(500).json({
                status: 500,
                message: "Failed to create OPD record"
            });
        }
    };


    updateOpdRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const opdId = req.params.id;
            const { address, age, appointmentDate, department ,doctor,email,firstName,gender, lastName, phone, symptoms } = req.body;

            const opdRecord = await OPDRegistration.findByPk(opdId);
            if (!opdRecord) {
                res.status(404).json({
                    status: 404,
                    message: "OPD record not found"
                });
                return;
            }
            await opdRecord.update({
                address,
                age,    
                appointmentDate,
                department,
                doctor,
                email,
                firstName,
                gender,
                lastName,
                phone,
                symptoms
            });
            res.status(200).json({
                status: 200,
                message: "OPD record updated successfully",
                data: opdRecord
            });
        }
        catch (error) {
            console.error("Error updating OPD record:", error);
            res.status(500).json({  
                status: 500,
                message: "Failed to update OPD record"
            });
        }   
    };

    deleteOpdRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const opdId = req.params.id;
            const opdRecord = await OPDRegistration.findByPk(opdId);
            if (!opdRecord) {
                res.status(404).json({
                    status: 404,
                    message: "OPD record not found"
                });
                return;
            }
            await opdRecord.destroy();
            res.status(200).json({
                status: 200,
                message: "OPD record deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting OPD record:", error);
            res.status(500).json({
                status: 500,
                message: "Failed to delete OPD record"
            });
        }
    };
    getPatientById = async (req: Request, res: Response): Promise<void> => {
        try {
            const opdId = req.params.id;
            const opdRecord = await OPDRegistration.findByPk(opdId, { raw: true });
            if (!opdRecord) {
                res.status(404).json({
                    status: 404,
                    message: "OPD record not found"
                });
                return;
            }

            res.status(200).json({
                status: 200,
                message: "OPD record fetched successfully",
                data: opdRecord
            });
        } catch (error) {
            console.error("Error fetching OPD record:", error);
            res.status(500).json({
                status: 500,
                message: "Failed to fetch OPD record"
            });
        }   
    };
}