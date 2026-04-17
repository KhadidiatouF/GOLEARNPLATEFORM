import { PrismaClient, Paiement, Prisma } from "@prisma/client";
import { IRepository } from "./IRepository";

export class PaiementRepo implements IRepository<Paiement> {
    private prisma: PrismaClient = new PrismaClient();

  async findAll(
  page: number = 1,
  limit: number = 10,
  professeurId?: number
): Promise<{ data: Paiement[]; total: number; page: number; limit: number }> {

    const skip = (page - 1) * limit;

    // ✅ CORRECTION : Maintenant la relation directe existe dans Paiement
   const whereClause = professeurId
    ? {
        apprenantFormation: {
            formation: {
                professeurId: professeurId
            }
        }
    }
    : {};

    const [paiements, total] = await Promise.all([
        this.prisma.paiement.findMany({
            skip,
            take: limit,
            where: whereClause,
            include: {
               apprenantFormation: {
                    include: {
                        apprenant: {
                            include: {
                                utilisateur: true
                            }
                        },
                        formation: true
                    }
                },
            },
            orderBy: { datePaiement: 'desc' }
        }),
        this.prisma.paiement.count({ where: whereClause })
    ]);

    return { data: paiements, total, page, limit };
}

   async findById(id: number): Promise<any> {
        return await this.prisma.paiement.findUnique({
            where: { id },
            include: {
                apprenantFormation: {
                    include: {
                        apprenant: {
                            include: {
                                utilisateur: true
                            }
                        },
                        formation: true
                    }
                }
            }
        });
    }

    async create(data: Prisma.PaiementCreateInput): Promise<Paiement> {
        return await this.prisma.paiement.create({ data });
    }

    async update(id: number, data: Prisma.PaiementUpdateInput): Promise<Paiement> {
        return await this.prisma.paiement.update({
            where: { id },
            data
        });
    }
    async delete(id: number): Promise<void> {
        await this.prisma.paiement.delete({ where: { id } });
    }
}
