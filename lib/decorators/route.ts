import 'reflect-metadata';

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

        descriptor.value = function (...args: any[]) {
            return originalMethod.apply(this, args);
        };

        existingRoutes.push({
            method,
            path,
            handler: descriptor.value,
        });

        Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target.constructor, propertyKey);
    };
}
