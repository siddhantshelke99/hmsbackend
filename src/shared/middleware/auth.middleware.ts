import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../constant/statuscode.constant';

export const AuthMiddlware = (req: Request,
    res: Response,
    next: NextFunction) => {
    let authorizationToken: string | undefined = "";

    if (!Object.keys(req.headers).includes('authorization')) {
        return res.status(StatusCodes.UNAUTHORISED).json({ response: { data: null, message: '', error: 'Authentication token is not provided', status: StatusCodes.UNAUTHORISED } })
    } else {
        authorizationToken = req.headers.authorization;
    }

    if (authorizationToken?.split(' ').length !== 2) {
        return res.status(StatusCodes.UNAUTHORISED).json({ response: { data: null, message: '', error: 'Invalid token format provided', status: StatusCodes.UNAUTHORISED } })
    }

    authorizationToken = authorizationToken?.split(' ')[1];

    try {
        next();
        return true
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORISED).json({ response: { data: null, message: '', error: 'Invalid token provided', status: StatusCodes.UNAUTHORISED } });
    }
}