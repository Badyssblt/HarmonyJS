import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';

// Middleware global de gestion des erreurs
export const globalErrorHandler: ErrorRequestHandler = (
    err,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        return;
    }

    res.status(500).json({
        status: 'error',
        message: 'Une erreur inattendue est survenue.',
        error: err.message || 'Erreur inconnue',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        code: 500
    });
};
