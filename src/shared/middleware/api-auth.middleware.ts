import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../constant/statuscode.constant';

export const ApiAuthMiddlware = (req: Request,
    res: Response,
    next: NextFunction) => {
    if (!Object.keys(req.headers).includes('authorization')) {
        return res.status(StatusCodes.UNAUTHORISED).json({ response: { data: null, message: null, error: 'Auth token is not provided', status: StatusCodes.UNAUTHORISED } })
    }

    const authorization: string | undefined | string[] = req.headers.authorization;

    try {
        if (authorization !== '3J8sG6HnBfPqW5rD7y9T')
            return res.status(StatusCodes.UNAUTHORISED).json({ response: { data: null, message: null, error: 'Auth token is invalid', status: StatusCodes.UNAUTHORISED } })
        else { next(); return true }
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORISED).json({ response: { data: null, message: '', error: 'Invalid token provided', status: StatusCodes.UNAUTHORISED } });
    }
}