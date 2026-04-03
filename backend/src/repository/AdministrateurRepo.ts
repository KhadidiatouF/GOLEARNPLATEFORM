import { PrismaClient, Administrateur } from "@prisma/client";
import { IRepository } from "./IRepository";

export class AdministrateurRepo implements IRepository<Administrateur> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(page: number = 1, limit: number = 10): Promise<{data:Administrateur[], total:number, page:number, limit:number}> {
        const skip = (page - 1) * limit;
        const [admins, total] = await Promise.all([
            this.prisma.administrateur.findMany({
                skip,
                take: limit,
                include: { utilisateur: true },
                orderBy: { id: 'desc' }
            }),
            this.prisma.administrateur.count()
        ]);
        return { data: admins, total, page, limit };
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.administrateur.findUnique({
            where: { id },
            include: { utilisateur: true }
        });
    }

    async create(data: Omit<Administrateur, "id">): Promise<Administrateur> {
        return await this.prisma.administrateur.create({ data });
    }

    async update(id: number, data: Administrateur): Promise<Administrateur> {
        return await this.prisma.administrateur.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.administrateur.delete({ where: { id } });
    }
}
