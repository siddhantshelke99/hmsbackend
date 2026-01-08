    import { Request, Response } from "express";

export interface _request extends Request {
    query: any;
    body: any;
    params: any;
    originalUrl: string;
}

export interface _response extends Response {
    json (data: object): any;
    status (statusCode: number): any;
    download  (data: string): any;
}