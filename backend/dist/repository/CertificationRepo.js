"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationRepo = void 0;
const client_1 = require("@prisma/client");
class CertificationRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10, apprenantId) {
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (apprenantId) {
            whereClause.apprenantId = apprenantId;
        }
        const [certs, total] = await Promise.all([
            this.prisma.certification.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    apprenant: { include: { utilisateur: true } },
                    formation: true
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.certification.count({ where: whereClause })
        ]);
        return { data: certs, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.certification.findUnique({
            where: { id },
            include: {
                apprenant: { include: { utilisateur: true } },
                formation: true
            }
        });
    }
    async findAllWithRelations(page = 1, limit = 100) {
        const skip = (page - 1) * limit;
        const [certs, total] = await Promise.all([
            this.prisma.certification.findMany({
                skip,
                take: limit,
                include: {
                    apprenant: { include: { utilisateur: true } },
                    formation: {
                        include: {
                            professeur: {
                                include: { utilisateur: true }
                            }
                        }
                    }
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.certification.count()
        ]);
        return { data: certs, total, page, limit };
    }
    async findByProfessorId(professeurId, page = 1, limit = 100) {
        const skip = (page - 1) * limit;
        const whereClause = {
            formation: {
                professeurId
            }
        };
        const [certs, total] = await Promise.all([
            this.prisma.certification.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    apprenant: { include: { utilisateur: true } },
                    formation: {
                        include: {
                            professeur: {
                                include: { utilisateur: true }
                            }
                        }
                    }
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.certification.count({ where: whereClause })
        ]);
        return { data: certs, total, page, limit };
    }
    async findByApprenantAndFormation(apprenantId, formationId) {
        return await this.prisma.certification.findFirst({
            where: { apprenantId, formationId }
        });
    }
    async create(data) {
        return await this.prisma.certification.create({ data });
    }
    async update(id, data) {
        return await this.prisma.certification.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.certification.delete({ where: { id } });
    }
}
exports.CertificationRepo = CertificationRepo;
//# sourceMappingURL=CertificationRepo.js.map