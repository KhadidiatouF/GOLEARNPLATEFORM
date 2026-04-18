"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfesseurRepo = void 0;
const client_1 = require("@prisma/client");
class ProfesseurRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [professeurs, total] = await Promise.all([
            this.prisma.professeur.findMany({
                skip,
                take: limit,
                include: {
                    utilisateur: true
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.professeur.count()
        ]);
        return { data: professeurs, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.professeur.findUnique({
            where: { id },
            include: {
                utilisateur: true
            }
        });
    }
    async findByUtilisateurId(utilisateurId) {
        return await this.prisma.professeur.findUnique({
            where: { utilisateurId }
        });
    }
    async create(data) {
        return await this.prisma.professeur.create({ data });
    }
    async update(id, data) {
        return await this.prisma.professeur.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await this.prisma.professeur.delete({ where: { id } });
    }
    async findByStatut(statut) {
        return await this.prisma.professeur.findMany({
            where: { statut: statut },
            include: { utilisateur: true }
        });
    }
    async updateStatut(id, statut) {
        return await this.prisma.professeur.update({
            where: { id },
            data: { statut: statut }
        });
    }
}
exports.ProfesseurRepo = ProfesseurRepo;
//# sourceMappingURL=ProfesseurRepo.js.map