
import { Users,Request,Response,ResponseObject,StatusCodes} from '../../shared/shared.module';
import {logsController} from '../logs/logs.controllers'

export class userController{

    private logsController: logsController;
    constructor(){
        this.logsController = new logsController();
    }
    
    public createUser = async (req: Request, res: Response) => {
        try {
            const {
                userCode,userName,contactNo,designation,department,roleId
            } = req.body;

            const userExist = await Users.findOne({where:{userCode}})

            let userCreationResult:any

             const  today =new Date

            if(!userExist){
                userCreationResult = await Users.create({
                    userCode,
                    userName,
                    contactNo,
                    designation,
                    department,
                    roleId,
                    createdAt:today ,
                }).then(result => result);
    
            }
          
            


            const response: ResponseObject = {
                response: {
                    data: userCreationResult,
                    error: null,
                    message: null,
                    status: StatusCodes.SUCCESS
                }
            };
            this.logsController.createLogs('Admin', 'Admin', ` ${userName} (${userCode}) is added to User Master`, 'User Master');
            return res.status(StatusCodes.SUCCESS).json(response);
        } catch (error) {
            console.error(error, "error");

           
            const response: ResponseObject = {
                response: {
                    data: null,
                    error,
                    message: null,
                    status: StatusCodes.SERVERERROR
                }
            };

            return res.status(StatusCodes.SERVERERROR).json(response);
        }
    }

    public updateUser = async (req: Request, res: Response) => {
        try {
            const {
                userCode,userName,contactNo,designation,department,roleId,userId
            } = req.body;


            const userUpdationResult = await Users.update({
                userCode,
                userName,
                contactNo,
                designation,
                department,
                roleId
            } ,{where:{id:userId}} ).then(result => result);


            const response: ResponseObject = {
                response: {
                    data: userUpdationResult,
                    error: null,
                    message: null,
                    status: StatusCodes.SUCCESS
                }
            };

            return res.status(StatusCodes.SUCCESS).json(response);
        } catch (error) {
            console.error(error, "error");

           
            const response: ResponseObject = {
                response: {
                    data: null,
                    error,
                    message: null,
                    status: StatusCodes.SERVERERROR
                }
            };

            return res.status(StatusCodes.SERVERERROR).json(response);
        }
    }

    public getUsers = async (req: Request, res: Response) => {
        try {
            
            const usersResult = await Users.findAll({   
            }).then(result => result);

            const response: ResponseObject = {
                response: {
                    data: usersResult,
                    error: null,
                    message: null,
                    status: StatusCodes.SUCCESS
                }
            };

            return res.status(StatusCodes.SUCCESS).json(response);
        } catch (error) {
            console.error(error, "error");

           
            const response: ResponseObject = {
                response: {
                    data: null,
                    error,
                    message: null,
                    status: StatusCodes.SERVERERROR
                }
            };

            return res.status(StatusCodes.SERVERERROR).json(response);
        }
    }

    
    }