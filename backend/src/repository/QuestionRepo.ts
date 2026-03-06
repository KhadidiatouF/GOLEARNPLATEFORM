import { PrismaClient, Question } from "@prisma/client";
import { IRepository } from "./IRepository";

export class QuestionRepo implements IRepository<Question> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(): Promise<Question[]> {
        return await this.prisma.question.findMany({
            include: { quiz: true, reponses: true }
        });
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.question.findUnique({
            where: { id },
            include: { quiz: true, reponses: true }
        });
    }

    async create(data: Omit<Question, "id">): Promise<Question> {
        return await this.prisma.question.create({ data });
    }

    async update(id: number, data: Question): Promise<Question> {
        return await this.prisma.question.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.question.delete({ where: { id } });
    }
}
