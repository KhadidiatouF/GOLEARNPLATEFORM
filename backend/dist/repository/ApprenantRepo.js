"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprenantRepo = void 0;
const client_1 = require("@prisma/client");
class ApprenantRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [apprenants, total] = await Promise.all([
            this.prisma.apprenant.findMany({
                skip,
                take: limit,
                include: {
                    utilisateur: true
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.apprenant.count()
        ]);
        return { data: apprenants, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.apprenant.findUnique({
            where: { id },
            include: {
                utilisateur: true,
                formations: {
                    include: {
                        formation: true
                    }
                },
                certifications: true,
            }
        });
    }
    async create(data) {
        return await this.prisma.apprenant.create({ data });
    }
    async update(id, data) {
        return await this.prisma.apprenant.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.apprenant.delete({ where: { id } });
    }
}
exports.ApprenantRepo = ApprenantRepo;
//# sourceMappingURL=ApprenantRepo.js.map