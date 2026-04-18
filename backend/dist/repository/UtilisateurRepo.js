"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilisateurRepo = void 0;
const client_1 = require("@prisma/client");
class UtilisateurRepo {
    prisma = new client_1.PrismaClient();
    async findAll(page = 1, limit = 10, role, search) {
        const skip = (page - 1) * limit;
        const whereClause = {};
        // Filtre par rôle
        if (role) {
            whereClause.role = role;
        }
        // Filtre par recherche sur nom, prénom ou email (sensible à la casse pour compatibilité)
        if (search && search.trim()) {
            const searchTerm = search.trim();
            whereClause.OR = [
                { nom: { contains: searchTerm } },
                { prenom: { contains: searchTerm } },
                { email: { contains: searchTerm } }
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.utilisateur.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    apprenant: true,
                    professeur: true
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.utilisateur.count({ where: whereClause })
        ]);
        return { data: users, total, page, limit };
    }
    async findById(id) {
        return await this.prisma.utilisateur.findUnique({ where: { id } });
    }
    async findByLogin(login) {
        return await this.prisma.utilisateur.findUnique({ where: { login } });
    }
    async create(data) {
        // Filtrer les champs undefined pour éviter les erreurs Prisma
        const cleanedData = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                cleanedData[key] = value;
            }
        }
        return await this.prisma.utilisateur.create({ data: cleanedData });
    }
    async update(id, data) {
        // Filtrer les champs undefined pour éviter les erreurs Prisma
        const cleanedData = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                cleanedData[key] = value;
            }
        }
        return await this.prisma.utilisateur.update({ where: { id }, data: cleanedData });
    }
    async delete(id) {
        await this.prisma.utilisateur.delete({ where: { id } });
    }
}
exports.UtilisateurRepo = UtilisateurRepo;
//# sourceMappingURL=UtilisateurRepo.js.map