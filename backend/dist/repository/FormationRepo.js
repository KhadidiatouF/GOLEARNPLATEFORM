"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationRepo = void 0;
const client_1 = require("@prisma/client");
class FormationRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [formations, total] = await Promise.all([
            this.prisma.formation.findMany({
                skip,
                take: limit,
                include: {
                    professeur: { include: { utilisateur: true } },
                    sessions: true,
                    apprenants: true
                },
                orderBy: { dateCreation: 'desc' }
            }),
            this.prisma.formation.count()
        ]);
        return { data: formations, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.formation.findUnique({
            where: { id },
            include: {
                professeur: { include: { utilisateur: true } },
                sessions: {
                    orderBy: { id: 'asc' },
                    include: {
                        chapitres: { orderBy: { ordre: 'asc' } },
                        quiz: {
                            include: {
                                questions: {
                                    include: { reponses: true }
                                }
                            }
                        }
                    }
                },
                apprenants: true
            }
        });
    }
    async create(data) {
        return await this.prisma.formation.create({ data });
    }
    async update(id, data) {
        return await this.prisma.formation.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.formation.delete({ where: { id } });
    }
    async findByProfesseurId(professeurId) {
        return await this.prisma.formation.findMany({
            where: { professeurId },
            include: {
                professeur: { include: { utilisateur: true } },
                sessions: true,
                apprenants: true
            }
        });
    }
    // Mettre à jour le statut de la formation
    async updateStatut(id, statut) {
        return await this.prisma.formation.update({
            where: { id },
            data: { statut: statut }
        });
    }
    // Trouver les formations par statut
    async findByStatut(statut) {
        return await this.prisma.formation.findMany({
            where: { statut: "VALIDEE" },
            include: {
                professeur: { include: { utilisateur: true } },
                sessions: true
            }
        });
    }
}
exports.FormationRepo = FormationRepo;
//# sourceMappingURL=FormationRepo.js.map