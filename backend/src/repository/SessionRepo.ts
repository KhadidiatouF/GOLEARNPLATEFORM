import { PrismaClient, Session } from "@prisma/client";
import { IRepository } from "./IRepository";

export class SessionRepo implements IRepository<Session> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(): Promise<Session[]> {
        return await this.prisma.session.findMany({
            include: { formation: true }
        });
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.session.findUnique({
            where: { id },
            include: { 
                formation: true,
                quiz: true
            }
        });
    }

    async create(data: Omit<Session, "id">): Promise<Session> {
        return await this.prisma.session.create({ data });
    }

    async update(id: number, data: Session): Promise<Session> {
        return await this.prisma.session.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.session.delete({ where: { id } });
    }
}
