import { NextFunction, Request, Response } from "express";
import { ResponseObject } from "../interface/response.interface";
import { StatusCodes } from '../constant/statuscode.constant';

export const NotFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const response: ResponseObject = {response: {data: null, message: `Not Found - ${req.originalUrl}`, error: '', status: StatusCodes.NOTFOUND}}
    return res.status(StatusCodes.NOTFOUND).json(response);
    next();
}