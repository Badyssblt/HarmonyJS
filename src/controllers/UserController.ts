import BaseController from "../../lib/core/BaseController";
import { Route } from '../../lib/decorators/route';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors/AppError';



class UserController {
    @Route('GET', '/user')
    async GetUser(req: Request, res: Response, next: NextFunction)
    {
        const error = new AppError('Not Found', 404);
        next(error);
    }
}

export default UserController;