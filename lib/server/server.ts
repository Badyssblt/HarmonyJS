import express, {NextFunction, Request, Response} from 'express';
import fs from 'fs-extra';
import path from 'path';
import 'reflect-metadata';
import {Route} from "../core/type/Route";
import {ROUTE_METADATA_KEY} from "../decorators/route";
import ErrorType from "../types/ErrorType";
import {globalErrorHandler} from "../middleware/errorHandler";
import {AppError} from "../errors/AppError";


const app = express();
app.use(express.json());




app.get('/error', (req, res, next) => {
    const error = new Error("Une erreur s'est produite !");
    next(error);
});



async function loadControllers(directory: string) {
    const files = await fs.readdir(directory);
    const routePromises = files.map((file) => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            return loadControllers(filePath);
        } else if (filePath.endsWith('.ts')) {
            return import(filePath).then((controllerModule) => {
                registerRoutes(controllerModule);
            }).catch(err => {
                console.error(`Erreur lors du chargement du fichier ${filePath}:`, err);
            });
        }

        return Promise.resolve();
    });

    await Promise.all(routePromises);
}

function registerRoutes(controllerModule: any) {
    const controllerPrototype = controllerModule.default.prototype;
    const methodNames = Object.getOwnPropertyNames(controllerPrototype)
        .filter(name => name !== 'constructor' && typeof controllerPrototype[name] === 'function');

    methodNames.forEach(methodName => {
        const routes = Reflect.getMetadata(ROUTE_METADATA_KEY, controllerModule.default, methodName);

        if (routes) {
            routes.forEach((route: Route) => {
                const method = route.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';

                app[method](route.path, async (req: Request, res: Response, next: NextFunction) => {
                    try {
                        const instance = new controllerModule.default();
                        const result = await instance[methodName](req, res, next);

                        if (result !== undefined) {
                            res.json(result);
                        }
                    } catch (err) {
                        console.log("Erreur:", err)
                        next(err);
                    }
                });
            });
        }
    });
}

const PORT = process.env.PORT || 3001;






app.use(globalErrorHandler)


const start = () => {
    loadControllers(path.join(__dirname, '../../src/controllers')).then(() => {
        app.use(globalErrorHandler);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    }).catch(err => {
        console.error('Erreur lors du chargement des contrôleurs:', err);
    });



};

export default start;
