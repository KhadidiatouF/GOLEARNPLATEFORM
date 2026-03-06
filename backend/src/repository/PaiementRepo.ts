import { PrismaClient, Paiement } from "@prisma/client";
import { IRepository } from "./IRepository";

export class PaiementRepo implements IRepository<Paiement> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(): Promise<Paiement[]> {
        return await this.prisma.paiement.findMany({
            include: { apprenant: { include: { utilisateur: true } } }
        });
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.paiement.findUnique({
            where: { id },
            include: { apprenant: { include: { utilisateur: true } } }
        });
    }

    async create(data: Omit<Paiement, "id">): Promise<Paiement> {
        return await this.prisma.paiement.create({ data });
    }

    async update(id: number, data: Paiement): Promise<Paiement> {
        return await this.prisma.paiement.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.paiement.delete({ where: { id } });
    }
}
