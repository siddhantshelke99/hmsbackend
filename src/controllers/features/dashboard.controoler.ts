import { Employee,  Attendance } from '../../../database/models';
import { Request, Response } from 'express';

export class DashboardController {

    public getdashData = async (req: Request, res: Response): Promise<Response> => {
        try {
            const employeesCount = await Employee.count();
            const totalPresent = await Attendance.count({ where: { status: 'P' } });
            const totalAbsent = await Attendance.count({ where: { status: 'A' } });

            // const rosters = await Roster.findAll({
            //     include: [{
            //         model: EmployeeRoster,
            //         as: 'employeeRosters',
            //         include: [{ model: Employee, as: 'employee' }]
            //     }]
            // });

            // const attendanceOverview = await Attendance.findAll({
            //     include: [{ model: Employee, as: 'employee' }]
            // });

            return res.status(200).json({
                message: "Dashboard data fetched successfully",
                data: {
                    employeesCount,
                    totalPresent,
                    totalAbsent,
                    // rosters,
                    // attendanceOverview
                }
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            return res.status(500).json({ message: "Failed to fetch dashboard data" });
        }
    };


    
}
