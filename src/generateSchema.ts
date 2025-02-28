// src/generateSchema.ts
import { writeFileSync } from 'fs';
import { UserModel } from './models/user';

const schemaContent = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

${UserModel}
`;

writeFileSync('prisma/schema.prisma', schemaContent);
console.log('Le fichier schema.prisma a été généré avec succès!');
