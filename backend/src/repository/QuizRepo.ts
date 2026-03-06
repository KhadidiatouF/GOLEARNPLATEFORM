import { PrismaClient, Quiz } from "@prisma/client";
import { IRepository } from "./IRepository";

export class QuizRepo implements IRepository<Quiz> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(): Promise<Quiz[]> {
        return await this.prisma.quiz.findMany({
            include: { formation: true, session: true }
        });
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.quiz.findUnique({
            where: { id },
            include: { formation: true, session: true, questions: { include: { reponses: true } } }
        });
    }

    async create(data: Omit<Quiz, "id">): Promise<Quiz> {
        return await this.prisma.quiz.create({ data });
    }

    async update(id: number, data: Quiz): Promise<Quiz> {
        return await this.prisma.quiz.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.quiz.delete({ where: { id } });
    }
}
