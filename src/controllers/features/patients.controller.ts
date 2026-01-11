import { Request, Response } from 'express';
import { PatientRegistration } from '../../../database/models';
import crypto from 'crypto';
import path from 'path';
import { MulterService } from '../../services/multer.service';
// import whatsappService from 'src/services/features/whatsapp.service';
// import smsService from 'src/services/features/sms.service';
const tempDir = path.join(process.cwd(), 'documents/temporary');
const permanentDir = path.join(process.cwd(), 'documents/permanent');

export const patientUploadMiddleware = MulterService.getMulterMiddleware(tempDir, permanentDir, [
  { name: 'photoFile', maxCount: 1 },
  { name: 'aadharFile', maxCount: 1 },
]);

export class PatientsController {

  public registerPatient = async (req: any, res: any): Promise<any> => {
    try {
      console.log('Files:', req.files); // Debugging log for files
      console.log('Body:', req.body); // Debugging log for body

      let patientId: string = "";
      let isUnique = false;
      while (!isUnique) {
        const tempId = crypto.randomInt(100000, 999999).toString();
        const existingPatient = await PatientRegistration.findOne({ where: { patientId: tempId } });
        if (!existingPatient) {
          patientId = tempId;
          isUnique = true;
        }
      }

      const photoFile = req.files?.['photoFile']?.[0];
      const aadharFile = req.files?.['aadharFile']?.[0];

      let photofilePath = null;
      let aadharfilePath = null;

      // Move photoFile to permanent directory
      if (photoFile) {
        const photoPermanentDir = path.join(permanentDir, 'photos');
        photofilePath = MulterService.moveFileToPermanent(photoFile, photoPermanentDir);
      }

      // Move aadharFile to permanent directory
      if (aadharFile) {
        const aadharPermanentDir = path.join(permanentDir, 'aadhar');
        aadharfilePath = MulterService.moveFileToPermanent(aadharFile, aadharPermanentDir);
      }

      // Process List Fields
      const processListField = (field: any) => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') return field.split(',').map(item => item.trim()).filter(Boolean);
        return [field];
      };

      // Safeguard for req.body
      const body = req.body || {};

      // Parse form data fields
      const {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        age,
        gender,
        bloodGroup,
        mobileNumber,
        alternateNumber,
        email,
        address,
        city,
        state,
        pincode,
        aadharNumber,
        emergencyContactName,
        emergencyContactNumber,
        emergencyContactRelation,
        allergies,
        chronicConditions,
        currentMedications,
        remarks,
      } = body;

      // Build Data
      const patientData = {
        patientId: patientId,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        age,
        gender,
        bloodGroup,
        mobileNumber,
        alternateNumber,
        email,
        address,
        city,
        state,
        pincode,
        aadharNumber,
        emergencyContactName,
        emergencyContactNumber,
        emergencyContactRelation,
        allergies: processListField(allergies),
        chronicConditions: processListField(chronicConditions),
        currentMedications: processListField(currentMedications),
        remarks,
        photofileName: photoFile?.originalname || null,
        photofilePath,
        aadharfileName: aadharFile?.originalname || null,
        aadharfilePath,
      };

      const newPatient = await PatientRegistration.create(patientData);

      // // Send WhatsApp Message
      // const whatsappMessage = `Dear ${firstName}, your registration is successful. Your Patient ID is ${patientId}.`;
      // await whatsappService.sendNotification(mobileNumber, whatsappMessage); 
      // // Send SMS
      // const smsMessage = `Registration successful. Patient ID: ${patientId}.`;
      // await smsService.sendSMS(mobileNumber, smsMessage);
      return res.status(201).json({
        message: 'Patient registered successfully',
        patientId: patientId,
        data: newPatient,
      });

    } catch (error) {
      console.error('Error in registerPatient:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

  public getAllPatients = async (req: Request, res: Response) => {
    try {
      const patients = await PatientRegistration.findAll();
      res.status(200).json({
        message: 'Patients retrieved successfully',
        data: patients,
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({
        message: 'Failed to fetch patients',
        error: error.message,
      });
    }
  };

  public getPatientById = async (req: Request, res: Response): Promise<any> => {
    try {
      const { patientId } = req.params;
      
      console.log('Fetching patient with ID:', patientId,); 
      const patient = await PatientRegistration.findOne({ where: { patientId } });

      if (!patient) {
        return res.status(404).json({
          message: 'Patient not found',
        });
      }

      res.status(200).json({
        message: 'Patient retrieved successfully',
        data: patient,
      });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({
        message: 'Failed to fetch patient',
        error: error.message,
      });
    }
  };
/**
   * Search patients
   */
  public searchPatients = async (req: Request, res: Response): Promise<any> => {
    try {
      const { query, patientId, name, mobileNumber, aadharNumber } = req.body;

      const whereClause: any = {};
      if (query) whereClause.name = { $like: `%${query}%` };
      if (patientId) whereClause.patientId = patientId;
      if (name) whereClause.name = { $like: `%${name}%` };
      if (mobileNumber) whereClause.mobileNumber = mobileNumber;
      if (aadharNumber) whereClause.aadharNumber = aadharNumber;

      const patients = await PatientRegistration.findAll({ where: whereClause });

      return res.status(200).json({
        message: 'Patients retrieved successfully',
        data: patients,
      });
    } catch (error) {
      console.error('Error in searchPatients:', error);
      return res.status(500).json({ message: 'Failed to search patients', error: error.message });
    }
  };

  /**
   * Update patient details
   */
  public updatePatient = async (req: Request, res: Response): Promise<any> => {
    try {
      const { patientId } = req.params;
      const updatedData = req.body;

      const patient = await PatientRegistration.findOne({ where: { patientId } });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      await patient.update(updatedData);

      return res.status(200).json({
        message: 'Patient updated successfully',
        data: patient,
      });
    } catch (error) {
      console.error('Error in updatePatient:', error);
      return res.status(500).json({ message: 'Failed to update patient', error: error.message });
    }
  };

  /**
   * Generate token
   */
  public generateToken = async (req: Request, res: Response): Promise<any> => {
    try {
      const tokenData = req.body;

      const newToken = await Token.create(tokenData);

      return res.status(201).json({
        message: 'Token generated successfully',
        data: newToken,
      });
    } catch (error) {
      console.error('Error in generateToken:', error);
      return res.status(500).json({ message: 'Failed to generate token', error: error.message });
    }
  };

  /**
   * Get today's tokens
   */
  public getTodaysTokens = async (req: Request, res: Response): Promise<any> => {
    try {
      const tokens = await Token.findAll({
        where: { tokenDate: new Date().toISOString().split('T')[0] },
      });

      return res.status(200).json({
        message: 'Tokens retrieved successfully',
        data: tokens,
      });
    } catch (error) {
      console.error('Error in getTodaysTokens:', error);
      return res.status(500).json({ message: 'Failed to fetch tokens', error: error.message });
    }
  };

  /**
   * Get patient history
   */
  public getPatientHistory = async (req: Request, res: Response): Promise<any> => {
    try {
      const { patientId } = req.params;

      const visits = await Visit.findAll({ where: { patientId } });
      const vitalSigns = await VitalSign.findAll({ where: { patientId } });

      return res.status(200).json({
        message: 'Patient history retrieved successfully',
        data: { visits, vitalSigns },
      });
    } catch (error) {
      console.error('Error in getPatientHistory:', error);
      return res.status(500).json({ message: 'Failed to fetch patient history', error: error.message });
    }
  };

  /**
   * Get patient statistics
   */
  public getPatientStats = async (_req: Request, res: Response): Promise<any> => {
    try {
      const totalPatients = await PatientRegistration.count();
      const todaysRegistrations = await PatientRegistration.count({
        where: { createdAt: new Date().toISOString().split('T')[0] },
      });

      return res.status(200).json({
        message: 'Patient statistics retrieved successfully',
        data: { totalPatients, todaysRegistrations },
      });
    } catch (error) {
      console.error('Error in getPatientStats:', error);
      return res.status(500).json({ message: 'Failed to fetch patient statistics', error: error.message });
    }
  };
}


  

