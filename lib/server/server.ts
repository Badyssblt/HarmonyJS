import express, { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import 'reflect-metadata';
import {Route} from "../core/type/Route";
import {ROUTE_METADATA_KEY} from "../decorators/route";

const app = express();

app.use(express.json());


async function loadControllers(directory: string) {
    const files = await fs.readdir(directory);
    files.forEach((file) => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            loadControllers(filePath);
        } else if (filePath.endsWith('.ts')) {
            import(filePath).then((controllerModule) => {
                registerRoutes(controllerModule);
            }).catch(err => {
                console.error(`Erreur lors du chargement du fichier ${filePath}:`, err);
            });
        }
    });
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

                app[method](route.path, async (req: Request, res: Response, next) => {
                    try {
                        const instance = new controllerModule.default();
                        const result = await instance[methodName](req, res, next);

                        if (result !== undefined) {
                            res.json(result);
                        }
                    } catch (err) {
                        next(err);
                    }
                });
            });
        }
    });
}


loadControllers(path.join(__dirname, '../../src/controllers')).then(() => {
});

const PORT = process.env.PORT || 3001;

const start = () => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

export default start;
