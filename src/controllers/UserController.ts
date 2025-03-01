import BaseController from "../../lib/core/BaseController";
import { Route } from '../../lib/decorators/route';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors/AppError';
import UserRepository from "../Repository/UserRepository";



class UserController {
    @Route('POST', '/user')
    async register(req: Request, res: Response, next: NextFunction)
    {
        const body = req.body;

        const repository = new UserRepository();

        return await repository.findAll()


    }
}

export default UserController;