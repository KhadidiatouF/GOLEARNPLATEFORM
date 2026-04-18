"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRepo = void 0;
const client_1 = require("@prisma/client");
class QuestionRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10) {
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
    async findById(id) {
        return await this.prisma.question.findUnique({
            where: { id },
            include: { quiz: true, reponses: true }
        });
    }
    async create(data) {
        return await this.prisma.question.create({ data });
    }
    async update(id, data) {
        return await this.prisma.question.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.question.delete({ where: { id } });
    }
}
exports.QuestionRepo = QuestionRepo;
//# sourceMappingURL=QuestionRepo.js.map