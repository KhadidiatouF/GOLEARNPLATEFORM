import { PrismaClient, Paiement } from "@prisma/client";
import { IRepository } from "./IRepository";

export class PaiementRepo implements IRepository<Paiement> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(page: number = 1, limit: number = 10): Promise<{data:Paiement[], total:number, page:number, limit:number}> {
        const skip = (page - 1) * limit;
        const [paiements, total] = await Promise.all([
            this.prisma.paiement.findMany({
                skip,
                take: limit,
                include: { apprenant: { include: { utilisateur: true } } },
                orderBy: { id: 'desc' }
            }),
            this.prisma.paiement.count()
        ]);
        return { data: paiements, total, page, limit };
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
