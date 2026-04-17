import { PrismaClient, Quiz } from "@prisma/client";
import { IRepository } from "./IRepository";

export class QuizRepo implements IRepository<Quiz> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(page: number = 1, limit: number = 10): Promise<{data:Quiz[], total:number, page:number, limit:number}> {
        const skip = (page - 1) * limit;
        const [quizzes, total] = await Promise.all([
            this.prisma.quiz.findMany({
                skip,
                take: limit,
                include: { formation: true, session: true },
                orderBy: { id: 'desc' }
            }),
            this.prisma.quiz.count()
        ]);
        return { data: quizzes, total, page, limit };
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.quiz.findUnique({
            where: { id },
            include: { formation: true, session: true, questions: { include: { reponses: true } } }
        });
    }

    // Trouver tous les quiz d'une formation
    async findByFormationId(formationId: number): Promise<Quiz[]> {
        return await this.prisma.quiz.findMany({
            where: { formationId },
            include: { session: true, questions: { include: { reponses: true } } }
        });
    }

    // Trouver le quiz par session
    async findBySessionId(sessionId: number): Promise<Quiz | null> {
        return await this.prisma.quiz.findFirst({
            where: { sessionId },
            include: { formation: true, session: true, questions: { include: { reponses: true } } }
        });
    }

    // Trouver les quiz d'une formation avec leurs questions et réponses
    async findByFormationIdWithDetails(formationId: number): Promise<any[]> {
        return await this.prisma.quiz.findMany({
            where: { formationId },
            include: { 
                session: true, 
                questions: { 
                    include: { reponses: true } 
                } 
            }
        });
    }

    // ✅ Trouver le quiz final d'une formation
    async findFinalQuizByFormation(formationId: number): Promise<any | null> {
        return await this.prisma.quiz.findFirst({
            where: {
                formationId,
                type: 'FINAL'
            },
            include: {
                questions: {
                    include: { reponses: true }
                }
            }
        });
    }

    // Mettre à jour le score d'un quiz
    async updateScore(id: number, score: number): Promise<Quiz> {
        return await this.prisma.quiz.update({
            where: { id },
            data: { score }
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
