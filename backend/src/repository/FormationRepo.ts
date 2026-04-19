import { PrismaClient, Formation } from "@prisma/client";
import { IRepository } from "./IRepository";

export class FormationRepo implements IRepository<Formation> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(page: number = 1, limit: number = 10): Promise<{data: Formation[], total: number, page: number, limit: number}> {
        const skip = (page - 1) * limit;
        const [formations, total] = await Promise.all([
            this.prisma.formation.findMany({
                skip,
                take: limit,
                include: { 
                    professeur: { include: { utilisateur: true } },
                    sessions: true,
                    apprenants: true
                },
                orderBy: { dateCreation: 'desc' }
            }),
            this.prisma.formation.count()
        ]);
        return { data: formations, total, page, limit };
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.formation.findUnique({
            where: { id },
            include: { 
                professeur: { include: { utilisateur: true } },
                sessions: {
                    orderBy: { id: 'asc' },
                    include: { 
                        chapitres: { orderBy: { ordre: 'asc' } }, 
                        quiz: {
                            include: {
                                questions: {
                                    include: { reponses: true }
                                }
                            }
                        }
                    }
                },
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

    async findByProfesseurId(professeurId: number): Promise<Formation[]> {
        return await this.prisma.formation.findMany({
            where: { professeurId },
            include: { 
                professeur: { include: { utilisateur: true } },
                sessions: true,
                apprenants: true
            }
        });
    }

    // Mettre à jour le statut de la formation
    async updateStatut(id: number, statut: string): Promise<Formation> {
        return await this.prisma.formation.update({
            where: { id },
            data: { statut: statut as any }
        });
    }

    // Trouver les formations par statut
    async findByStatut(statut: string): Promise<Formation[]> {
        return await this.prisma.formation.findMany({
            where: { statut: "VALIDEE" },
            include: { 
                professeur: { include: { utilisateur: true } },
                sessions: true
            }
        });
    }
}
