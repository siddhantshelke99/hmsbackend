import express from "express";


export abstract class BaseRoute {
    protected router = express.Router();
    protected abstract initiateRoutes (): void;
    public getRoute () {
        return this.router;
    }
}