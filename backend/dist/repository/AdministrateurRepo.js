"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministrateurRepo = void 0;
const client_1 = require("@prisma/client");
class AdministrateurRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [admins, total] = await Promise.all([
            this.prisma.administrateur.findMany({
                skip,
                take: limit,
                include: { utilisateur: true },
                orderBy: { id: 'desc' }
            }),
            this.prisma.administrateur.count()
        ]);
        return { data: admins, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.administrateur.findUnique({
            where: { id },
            include: { utilisateur: true }
        });
    }
    async create(data) {
        return await this.prisma.administrateur.create({ data });
    }
    async update(id, data) {
        return await this.prisma.administrateur.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.administrateur.delete({ where: { id } });
    }
}
exports.AdministrateurRepo = AdministrateurRepo;
//# sourceMappingURL=AdministrateurRepo.js.map