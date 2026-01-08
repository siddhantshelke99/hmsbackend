import { _request, _response } from "src/interfaces/http.interface";
import { Employee, emp_role_assignment, Auth } from '../../../database/models';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthController {

  public loginAuth = async (req: _request, res: _response): Promise<void> => {
        try {
     
            const { email, password } = req.body; 

            if (!email || !password) {
                res.status(400).json({
                    status: 400,
                    message: "Email and password are required"
                });
                return;
            }

            const authUser = await Auth.findOne({
                where: { userId: email, password },
                raw: true
            });

            if (!authUser) {
                res.status(401).json({
                    status: 401,
                    message: "Invalid email or password"
                });
                return;
            }

           
            const employee = await Employee.findOne({
                where: { empId: authUser.userId }, 
                raw: true
            });

            if (!employee) {
                res.status(404).json({
                    status: 404,
                    message: "Employee not found"
                });
                return;
            }

      
            const roleAssign = await emp_role_assignment.findOne({
                where: { emp_id: employee.empId }, 
                raw: true
            });

            let roleName = 'Employee';
            if (roleAssign?.role_id) {
                switch (roleAssign.role_id) {
                    case 'ADMIN':
                        roleName = 'Admin';
                        break;
                    case 'DOCTOR':
                        roleName = 'Doctor';
                        break;
                    case 'PHARMACY':
                        roleName = 'Pharmacy';
                        break;
                    case 'OPD':
                        roleName = 'OPD';
                        break;
                    default:
                        roleName = 'Employee';
                }
            }

            const userPayload = {
                id: employee.id,        
                empId: employee.empId,  
                name: employee.name,
                email: employee.email,
                role: roleName,
                department: employee.department,
                status: employee.status
            };

            const token = jwt.sign(
                userPayload,
                process.env.ACCESS_TOKEN_KEY as string,
                { expiresIn: '1d' }
            );

            res.status(200).json({
                status: 200,
                message: `${roleName} login successful`,
                user: userPayload,
                token
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                status: 500,
                message: "Internal server error"
            });
        }
    }
}
