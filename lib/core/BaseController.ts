import { Request } from 'express';
import jwt from 'jsonwebtoken';

class BaseController {
    protected static request: Request;

    static setRequest(req: Request) {
        this.request = req;
    }

    static getRequest() {
        BaseController.request
    }

    protected getUser() {
        console.log("BaseController: this.request", BaseController.request);

        if (!BaseController.request) {
            throw new Error('Request is not initialized in BaseController');
        }

        try {
            const authHeader = BaseController.request.headers.authorization;
            if (!authHeader) {
                throw new Error('No token provided');
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new Error('Invalid token format');
            }

            const secretKey = process.env.JWT_SECRET || 'default_secret';
            const decoded = jwt.verify(token, secretKey);

            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
}

export default BaseController;
