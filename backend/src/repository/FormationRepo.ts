import { PrismaClient, Formation } from "@prisma/client";
import { IRepository } from "./IRepository";

export class FormationRepo implements IRepository<Formation> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(): Promise<Formation[]> {
        return await this.prisma.formation.findMany({
            include: { 
                professeur: { include: { utilisateur: true } },
                sessions: true
            }
        });
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.formation.findUnique({
            where: { id },
            include: { 
                professeur: { include: { utilisateur: true } },
                sessions: true,
                apprenants: true
            }
        });
    }

    async create(data: Omit<Formation, "id">): Promise<Formation> {
        return await this.prisma.formation.create({ data });
    }

    async update(id: number, data: Formation): Promise<Formation> {
        return await this.prisma.formation.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.formation.delete({ where: { id } });
    }
}
