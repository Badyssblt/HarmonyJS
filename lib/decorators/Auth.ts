import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

const verifyToken = (token: string) => {
    return new Promise<any>((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                reject(new Error('Invalid token'));
            } else {
                resolve(decoded);
            }
        });
    });
};

// Décorateur @Auth
function Auth(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            const token = authHeader.split(' ')[1];

            const user = await verifyToken(token);
            (req as any).user = user;

            return originalMethod.apply(this, [req, res, next]);
        } catch (error) {
            // @ts-ignore
            return res.status(401).json({ message: 'Unauthorized: ' + error.message });
        }
    };

    return descriptor;
}

export default Auth;
