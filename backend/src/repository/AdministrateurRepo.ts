import { PrismaClient, Administrateur } from "@prisma/client";
import { IRepository } from "./IRepository";

export class AdministrateurRepo implements IRepository<Administrateur> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(): Promise<Administrateur[]> {
        return await this.prisma.administrateur.findMany({
            include: { utilisateur: true }
        });
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
