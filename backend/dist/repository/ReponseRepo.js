"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReponseRepo = void 0;
const client_1 = require("@prisma/client");
class ReponseRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [reponses, total] = await Promise.all([
            this.prisma.reponse.findMany({
                skip,
                take: limit,
                include: { question: true },
                orderBy: { id: 'desc' }
            }),
            this.prisma.reponse.count()
        ]);
        return { data: reponses, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.reponse.findUnique({
            where: { id },
            include: { question: true }
        });
    }
    async create(data) {
        return await this.prisma.reponse.create({ data });
    }
    async update(id, data) {
        return await this.prisma.reponse.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.reponse.delete({ where: { id } });
    }
}
exports.ReponseRepo = ReponseRepo;
//# sourceMappingURL=ReponseRepo.js.map