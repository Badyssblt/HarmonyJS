import 'reflect-metadata';
import {asyncHandler} from "../middleware/asyncHandler";
import {NextFunction} from "express";
import express from 'express';

interface RouteMetadata {
    method: string;
    path: string;
    handler: Function;
}

export const ROUTE_METADATA_KEY = Symbol('ROUTE_METADATA_KEY');

// Décorateur @Route
export function Route(method: string, path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const existingRoutes: RouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];
        const originalMethod = descriptor.value;

        descriptor.value = asyncHandler(async (req: Request, res: express.Response, next: NextFunction) => {
            const result = await originalMethod.call(target, req, res, next);

            if (result !== undefined) {
                res.json(result);
            }
        });

        existingRoutes.push({
            method,
            path,
            handler: descriptor.value,
        });

        Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target.constructor, propertyKey);
    };
}
