import { PrismaClient, Reponse } from "@prisma/client";
import { IRepository } from "./IRepository";

export class ReponseRepo implements IRepository<Reponse> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(): Promise<Reponse[]> {
        return await this.prisma.reponse.findMany({
            include: { question: true }
        });
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.reponse.findUnique({
            where: { id },
            include: { question: true }
        });
    }

    async create(data: Omit<Reponse, "id">): Promise<Reponse> {
        return await this.prisma.reponse.create({ data });
    }

    async update(id: number, data: Reponse): Promise<Reponse> {
        return await this.prisma.reponse.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.reponse.delete({ where: { id } });
    }
}
