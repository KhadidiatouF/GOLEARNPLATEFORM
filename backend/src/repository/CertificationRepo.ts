import { PrismaClient, Certification } from "@prisma/client";
import { IRepository } from "./IRepository";

export class CertificationRepo implements IRepository<Certification> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(): Promise<Certification[]> {
        return await this.prisma.certification.findMany({
            include: { 
                apprenant: { include: { utilisateur: true } },
                formation: true
            }
        });
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
