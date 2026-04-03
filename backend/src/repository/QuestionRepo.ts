import { PrismaClient, Question } from "@prisma/client";
import { IRepository } from "./IRepository";

export class QuestionRepo implements IRepository<Question> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(page: number = 1, limit: number = 10): Promise<{data:Question[], total:number, page:number, limit:number}> {
        const skip = (page - 1) * limit;
        const [questions, total] = await Promise.all([
            this.prisma.question.findMany({
                skip,
                take: limit,
                include: { quiz: true, reponses: true },
                orderBy: { id: 'desc' }
            }),
            this.prisma.question.count()
        ]);
        return { data: questions, total, page, limit };
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
