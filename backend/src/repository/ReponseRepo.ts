import { PrismaClient, Reponse } from "@prisma/client";
import { IRepository } from "./IRepository";

export class ReponseRepo implements IRepository<Reponse> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(page: number = 1, limit: number = 10): Promise<{data:Reponse[], total:number, page:number, limit:number}> {
        const skip = (page - 1) * limit;
        const [reponses, total] = await Promise.all([
            this.prisma.reponse.findMany({
                skip,
                take: limit,
                include: { question: true },
                orderBy: { id: 'desc' }
            }),
            this.prisma.reponse.count()
        ]);
        return { data: reponses, total, page, limit };
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
