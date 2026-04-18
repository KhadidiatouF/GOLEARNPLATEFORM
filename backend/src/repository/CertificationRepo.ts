import { PrismaClient, Certification } from "@prisma/client";
import { IRepository } from "./IRepository";

export class CertificationRepo implements IRepository<Certification> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(page: number = 1, limit: number = 10, apprenantId?: number): Promise<{data:Certification[], total:number, page:number, limit:number}> {
        const skip = (page - 1) * limit;
        
        const whereClause: any = {};
        if (apprenantId) {
            whereClause.apprenantId = apprenantId;
        }

        const [certs, total] = await Promise.all([
            this.prisma.certification.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: { 
                    apprenant: { include: { utilisateur: true } },
                    formation: true
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.certification.count({ where: whereClause })
        ]);
        return { data: certs, total, page, limit };
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.certification.findUnique({
            where: { id },
            include: { 
                apprenant: { include: { utilisateur: true } },
                formation: true
            }
        });
    }

    async findByApprenantAndFormation(apprenantId: number, formationId: number): Promise<Certification | null> {
        return await this.prisma.certification.findFirst({
            where: { apprenantId, formationId }
        });
    }

    async create(data: Omit<Certification, "id">): Promise<Certification> {
        return await this.prisma.certification.create({ data });
    }

    async update(id: number, data: Certification): Promise<Certification> {
        return await this.prisma.certification.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.certification.delete({ where: { id } });
    }
}
