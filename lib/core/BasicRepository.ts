import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class BasicRepository {
    private readonly target: string;
    private readonly model: { findUnique?: Function; findMany?: Function; create?: Function; update?: Function };

    constructor() {
        this.target = this.constructor.name.replace(/Repository$/, '');
        this.model = prisma[this.target as keyof typeof prisma] as { findUnique?: Function; findMany?: Function; create?: Function; update?: Function };
    }

    async findAll() {
        if (this.model.findMany) {
            return await this.model.findMany();
        }
        throw new Error(`${this.target} model does not have a findMany method.`);
    }

    async findOne(id: number) {
        if (this.model.findUnique) {
            return await this.model.findUnique({
                where: { id },
            });
        }
        throw new Error(`${this.target} model does not have a findUnique method.`);
    }

    async create(data: any) {
        if (this.model.create) {
            return await this.model.create(data);
        }
        throw new Error(`${this.target} model does not have a create method.`);
    }

    async update(id: number, data: any) {
        if (this.model.update) {
            return await this.model.update({
                where: { id },
                data,
            });
        }
        throw new Error(`${this.target} model does not have an update method.`);
    }
}
