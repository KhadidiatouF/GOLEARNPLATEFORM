import { PrismaClient,Professeur } from "@prisma/client";
import { IRepository } from "./IRepository";



export class ProfesseurRepo implements IRepository <Professeur>{
    private prisma : PrismaClient = new PrismaClient();
    
    async findAll(page: number = 1, limit: number = 10): Promise<{data:Professeur[], total:number, page:number, limit:number}> {
        const skip = (page - 1) * limit;
        const [professeurs, total] = await Promise.all([
            this.prisma.professeur.findMany({
                skip,
                take: limit,
                include: {
                    utilisateur: true
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.professeur.count()
        ]);
        return { data: professeurs, total, page, limit };
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.professeur.findUnique({
            where: {id},
            include: {
                utilisateur: true
            }
        });
    }

    async findByUtilisateurId(utilisateurId: number): Promise<Professeur | null> {
        return await this.prisma.professeur.findUnique({
            where: { utilisateurId }
        });
    }

    async create(data: Omit<Professeur, "id">): Promise<Professeur> {
        return await this.prisma.professeur.create({ data });
    }

    async update(id: number, data: Partial<Professeur>): Promise<Professeur> {
        return await this.prisma.professeur.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.professeur.delete({ where: { id } });
    }

    async findByStatut(statut: string): Promise<Professeur[]> {
        return await this.prisma.professeur.findMany({
            where: { statut: statut as any },
            include: { utilisateur: true }
        });
    }

    async updateStatut(id: number, statut: string): Promise<Professeur> {
        return await this.prisma.professeur.update({
            where: { id },
            data: { statut: statut as any }
        });
    }
}
