"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepo = void 0;
const client_1 = require("@prisma/client");
class SessionRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [sessions, total] = await Promise.all([
            this.prisma.session.findMany({
                skip,
                take: limit,
                include: { formation: true },
                orderBy: { id: 'desc' }
            }),
            this.prisma.session.count()
        ]);
        return { data: sessions, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.session.findUnique({
            where: { id },
            include: {
                formation: true,
                quiz: true
            }
        });
    }
    async create(data) {
        return await this.prisma.session.create({ data });
    }
    async update(id, data) {
        return await this.prisma.session.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.session.delete({ where: { id } });
    }
}
exports.SessionRepo = SessionRepo;
//# sourceMappingURL=SessionRepo.js.map