// import { Users, Request, Response, ResponseObject, StatusCodes } from '../../shared/shared.module';
import { Employee, emp_role_assignment, Auth } from '../../../database/models';
import { _request, _response } from "src/interfaces/http.interface";
import { Request, Response } from 'express';
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

export class EmployeeController {

    public createEmployee = async (req: _request, res: _response) => {
        try {
            const { name, empId, email, department, position, joinDate, status, phone, address, salary, manager, role_id } = req.body;
            console.log("Request Body:", req.body);

            // Create employee
            const newEmployee = await Employee.create({
                name, email, empId, department, position, joinDate, status, phone, address, salary, manager
            });

            const password = newEmployee.id.toString(); // Ensure password is a string
            const emp_code = `EMP${newEmployee.id}`;

            await Employee.update({ empId:emp_code }, { where: { id: newEmployee.id } });

            // Use provided role_id or default to 10 if not provided
            const assignedRoleId = role_id || 10;

            // Hash password in parallel with role assignment
            const [salt,] = await Promise.all([
                bcryptjs.genSalt(saltRounds),
                emp_role_assignment.create({
                    emp_id: newEmployee.id,
                    role_id: assignedRoleId,
                    user_code: emp_code,
                    emp_dept: department,
                    emp_designation: position,
                    status: status
                })
            ]);

            const hashedPassword = await bcryptjs.hash(password, salt);

            // Create authentication record
            const auth = await Auth.create({
                userId: newEmployee.id,
                user_code: emp_code,
                is_employee: 1,
                user_name: name,
                password: hashedPassword,
                code: password
            });

            const employee = {
                Name: newEmployee.name,
                email: newEmployee.email,
                department: newEmployee.department,
                position: newEmployee.position
            };

            // Send email in the background (no need to wait for it)
            this.prepareEmail(employee, auth).catch(err => console.warn("Email sending failed:", err));

            console.log("Employee Created Successfully:", newEmployee);
            res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
        } catch (error) {
            console.error("Error during Employee Creation:", error);
            res.status(500).json({ message: "An error occurred while creating the employee", error: error.message });
        }
    };


    public async prepareEmail(employee, auth): Promise<boolean> {
        try {
            const html_content = fs.readFileSync("./resources/email_templates/employee_onboarding.html", "utf-8");
            const template = handlebars.compile(html_content);

            const replacements = {
                Name: employee.Name,
                userName: auth.user_code,
                password: auth.code,
            };

            const htmlToSend = template(replacements);

            const transport = nodemailer.createTransport({
                host: process.env.ATTENDANCE_MAIL_HOST,
                port: parseInt(process.env.ATTENDANCE_MAIL_PORT || "587"),
                secure: false,
                auth: {
                    user: process.env.ATTENDANCE_MAIL_USERNAME,
                    pass: process.env.ATTENDANCE_MAIL_PASSWORD,
                },
                tls: { rejectUnauthorized: false }
            });

            const message = {
                from: `${process.env.ATTENDANCE_SENDER_ID} <${process.env.ATTENDANCE_MAIL_USERNAME}>`,
                to: employee.email,
                subject: `${employee.Name} | Onboarded`,
                html: htmlToSend,
            };

            const info = await transport.sendMail(message);
            console.log("Email sent successfully:", info.response);
            return true;
        } catch (error) {
            console.error("Error in prepareEmail:", error);
            return false;
        }
    }


    public getEmployee = async (req: _request, res: _response) => {
        try {
            const data = await Employee.findAll({

                paranoid: true,
            });
            return res.status(200).json({ data: data });
        } catch (error) {
            console.error('Error fetching Inventory:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    }



    public updateEmployee = async (req: _request, res: _response): Promise<void> => {
        try {
            const { id, name, email, department, position, joinDate, status, phone, address, salary, manager } = req.body;
            console.log(id, "id is geting ");
            console.log(req.body);

            const existingEmployee = await Employee.findOne({ where: { id } });
            if (existingEmployee) {
                await Employee.update(
                    { name, email, department, position, joinDate, status, phone, address, salary, manager },
                    { where: { id } }
                );
                return res.status(200).json({ message: "Employee updated successfully" });
            }
            // const newEmployee = await Employees.create({
            //     name, email, department, position, joinDate, status, phone, address, salary, manager
            // });

            // console.log("Employee Created:", newEmployee);
            // res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
        } catch (error) {
            console.error("Error during Creating Employee:", error);
            res.status(500).json({ message: "An error occurred during Creating Employee" });
        }
    };

    public bulkEmployee = async (req: Request, res: Response): Promise<Response> => {
        try {
            const employees = req.body;

            if (!Array.isArray(employees) || employees.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid data format. Expected an array of employees.",
                });
            }

            console.log("Received Employee Data:", employees);

            const createdEmployees = [];

            console.log(createdEmployees);
            
            // Process each employee in parallel using Promise.all
            const newEmployees = await Promise.all(employees.map(async (employee) => {
                try {
                    const { name, email, department, position, joinDate, status, phone, address, salary, manager } = employee;

                    // Create employee record
                    const newEmployee = await Employee.create({
                        name, email, department, position, joinDate, status, phone, address, salary, manager,
                    });

                    return newEmployee;
                } catch (err) {
                    console.error("Error creating employee:", err);
                    return null;
                }
            }));

            // Filter out null values in case of errors
            const validEmployees = newEmployees.filter(emp => emp !== null);

            // Update empId for all employees in parallel
            await Promise.all(validEmployees.map(async (employee) => {
                const emp_code = `EMP${employee.id}`;
                await Employee.update({ empId: emp_code }, { where: { id: employee.id } });

                // Hash password & Assign role in parallel
                const password = employee.id.toString();
                const [salt,] = await Promise.all([
                    bcryptjs.genSalt(saltRounds),
                    emp_role_assignment.create({
                        emp_id: employee.id,
                        role_id: 10,
                        user_code: emp_code,
                        emp_dept: employee.department,
                        emp_designation: employee.position,
                        status: employee.status
                    })
                ]);

                const hashedPassword = await bcryptjs.hash(password, salt);

                // Create authentication record
                const auth = await Auth.create({
                    userId: employee.id,
                    user_code: emp_code,
                    is_employee: 1,
                    user_name: employee.name,
                    password: hashedPassword,
                    code: password
                });

                const employeeDetails = {
                    Name: employee.name,
                    email: employee.email,
                    department: employee.department,
                    position: employee.position
                };

                this.prepareEmail(employeeDetails, auth).catch(err => console.warn("Email sending failed:", err));

                return employee;
            }));

            return res.status(201).json({
                success: true,
                message: `${validEmployees.length} employees uploaded successfully.`,
                data: validEmployees,
            });

        } catch (error) {
            console.error("Error during bulk employee upload:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while processing the bulk employee upload.",
                error: error.message,
            });
        }
    };





}