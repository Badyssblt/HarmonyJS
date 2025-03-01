import BaseController from "../../lib/core/BaseController";
import { Route } from '../../lib/decorators/route';
import { Request, Response, NextFunction } from 'express';
import UserRepository from "../Repository/UserRepository";
import JsonLoginService from "../../lib/core/services/jsonLoginService";
import bcrypt from 'bcrypt';
import {AppError} from "../../lib/errors/AppError";
import Auth from "../../lib/decorators/Auth";


class UserController extends BaseController {


    @Route('POST', '/user')
    async register(req: Request, res: Response, next: NextFunction)
    {
        const body = req.body;

        const repository = new UserRepository();

        const hashedPassword = await bcrypt.hash(body.password, 10);

        return repository.create(
            {
                email: body.email,
                password: hashedPassword,
                firstname: body.firstname,
            }
        );

    }

    @Route('POST', '/login')
    async login(req: Request, res: Response, next: NextFunction)
    {
        const body = req.body;

        const loginService = new JsonLoginService();

        const repository = new UserRepository();

        const user = await repository.findBy({
            where: {
                email: body.email
            }
        })

        if (!user) {
            throw new AppError("Cette email n'existe pas !", 401);
        }

        const passwordMatch = await bcrypt.compare(body.password, user.password);

        if (!passwordMatch) {
            throw new AppError("Le mot de passe est incorrect...", 401);
        }

        const token = loginService.login({ email: body.email, password: body.password });

        return {
            token: token
        }
    }

    @Auth
    @Route('GET', '/me')
    async me()
    {
        const user = this.getUser()

        return user;
    }
}

export default UserController;