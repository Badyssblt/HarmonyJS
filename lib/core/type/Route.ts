import {Request, Response} from "express";

export interface Route {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    handler: (req: Request, res: Response) => void;
}
