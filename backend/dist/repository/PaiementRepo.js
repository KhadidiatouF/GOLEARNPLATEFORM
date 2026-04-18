"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiementRepo = void 0;
const client_1 = require("@prisma/client");
class PaiementRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10, professeurId) {
        const skip = (page - 1) * limit;
        // ✅ CORRECTION : Maintenant la relation directe existe dans Paiement
        const whereClause = professeurId
            ? {
                apprenantFormation: {
                    formation: {
                        professeurId: professeurId
                    }
                }
            }
            : {};
        const [paiements, total] = await Promise.all([
            this.prisma.paiement.findMany({
                skip,
                take: limit,
                where: whereClause,
                include: {
                    apprenantFormation: {
                        include: {
                            apprenant: {
                                include: {
                                    utilisateur: true
                                }
                            },
                            formation: true
                        }
                    },
                },
                orderBy: { datePaiement: 'desc' }
            }),
            this.prisma.paiement.count({ where: whereClause })
        ]);
        return { data: paiements, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.paiement.findUnique({
            where: { id },
            include: {
                apprenantFormation: {
                    include: {
                        apprenant: {
                            include: {
                                utilisateur: true
                            }
                        },
                        formation: true
                    }
                }
            }
        });
    }
    async create(data) {
        return await this.prisma.paiement.create({ data });
    }
    async update(id, data) {
        return await this.prisma.paiement.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await this.prisma.paiement.delete({ where: { id } });
    }
}
exports.PaiementRepo = PaiementRepo;
//# sourceMappingURL=PaiementRepo.js.map