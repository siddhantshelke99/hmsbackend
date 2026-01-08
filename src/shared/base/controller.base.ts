import { Request, Response } from "express";

export abstract class BaseController {
    abstract create?(req: Request, res: Response): Response;
    abstract update?(req: Request, res: Response): Response;
    abstract read?(req: Request, res: Response): Response;
    abstract readAll?(req: Request, res: Response): Response;
}