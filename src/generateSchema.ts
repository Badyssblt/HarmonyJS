// src/generateSchema.ts
import { writeFileSync } from 'fs';
import path from "path";
import {readdirSync} from "node:fs";

const getModels = () => {
    const modelsDir = path.join(__dirname, './models');
    const modelFiles = readdirSync(modelsDir);


    let modelsContent = '';

    modelFiles.forEach((file) => {
        if(file.endsWith('.ts')){
            const filePath = path.join(modelsDir, file);

            const modelModule = require(filePath);

            if (modelModule.default) {
                modelsContent += modelModule.default + '\n';
            } else if (modelModule.Model) {
                modelsContent += modelModule.Model + '\n';
            }
        }
    })

    return modelsContent;
}

const provider = process.env.DB_TYPE || 'mysql';

const schemaContent = `
datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

${getModels()}
`;

writeFileSync('prisma/schema.prisma', schemaContent);
console.log('Le fichier schema.prisma a été généré avec succès!');
