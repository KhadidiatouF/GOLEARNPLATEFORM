"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRepo = void 0;
const client_1 = require("@prisma/client");
class QuizRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10) {
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
    async findById(id) {
        return await this.prisma.quiz.findUnique({
            where: { id },
            include: { formation: true, session: true, questions: { include: { reponses: true } } }
        });
    }
    // Trouver tous les quiz d'une formation
    async findByFormationId(formationId) {
        return await this.prisma.quiz.findMany({
            where: { formationId },
            include: { session: true, questions: { include: { reponses: true } } }
        });
    }
    // Trouver le quiz par session
    async findBySessionId(sessionId) {
        return await this.prisma.quiz.findFirst({
            where: { sessionId },
            include: { formation: true, session: true, questions: { include: { reponses: true } } }
        });
    }
    // Trouver les quiz d'une formation avec leurs questions et réponses
    async findByFormationIdWithDetails(formationId) {
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
    async findFinalQuizByFormation(formationId) {
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
    async updateScore(id, score) {
        return await this.prisma.quiz.update({
            where: { id },
            data: { score }
        });
    }
    async create(data) {
        return await this.prisma.quiz.create({ data });
    }
    async update(id, data) {
        return await this.prisma.quiz.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.quiz.delete({ where: { id } });
    }
}
exports.QuizRepo = QuizRepo;
//# sourceMappingURL=QuizRepo.js.map