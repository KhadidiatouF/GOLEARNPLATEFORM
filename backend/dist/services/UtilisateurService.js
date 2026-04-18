"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilisateurService = void 0;
const UtilisateurRepo_1 = require("../repository/UtilisateurRepo");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
class UtilisateurService {
    utilisateurRepo;
    constructor() {
        this.utilisateurRepo = new UtilisateurRepo_1.UtilisateurRepo();
    }
    getAllUser(page = 1, limit = 5, role, search) {
        return this.utilisateurRepo.findAll(page, limit, role, search);
    }
    getOneUser(id) {
        return this.utilisateurRepo.findById(id);
    }
    // createUser(data: any){
    //     return this.utilisateurRepo.create(data)
    // }
    async createUser(data) {
        if (data.mdp) {
            data.mdp = await bcryptjs_1.default.hash(data.mdp, 10);
        }
        const { niveau, specialite, bio, role, ...userData } = data;
        try {
            const user = await this.utilisateurRepo.create({
                ...userData,
                role
            });
            if (role === 'APPRENANT') {
                await prisma.apprenant.create({
                    data: {
                        utilisateurId: user.id,
                        niveau: niveau || null
                    }
                });
            }
            if (role === 'PROF') {
                await prisma.professeur.create({
                    data: {
                        utilisateurId: user.id,
                        specialite: specialite || null,
                        bio: bio || null,
                        statut: client_1.StatutProfesseur.VALIDE
                    }
                });
            }
            return user;
        }
        catch (error) {
            console.error('Erreur dans createUser:', error);
            throw error;
        }
    }
    async updateUser(id, data) {
        const { niveau, specialite, bio, role, ...userData } = data;
        try {
            const user = await this.utilisateurRepo.update(id, {
                ...userData,
                role
            });
            if (role === 'APPRENANT') {
                await prisma.apprenant.upsert({
                    where: { utilisateurId: id },
                    update: {
                        niveau: niveau || null
                    },
                    create: {
                        utilisateurId: id,
                        niveau: niveau || null
                    }
                });
            }
            if (role === 'PROF') {
                await prisma.professeur.upsert({
                    where: { utilisateurId: id },
                    update: {
                        specialite: specialite || null,
                        bio: bio || null
                    },
                    create: {
                        utilisateurId: id,
                        specialite: specialite || null,
                        bio: bio || null,
                        statut: "VALIDE"
                    }
                });
            }
            return user;
        }
        catch (error) {
            console.error("Erreur updateUser:", error);
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    deleteUser(id) {
        prisma.apprenant.deleteMany({
            where: { utilisateurId: id }
        }).catch(() => { }); // Ignorer si n'existe pas
        prisma.professeur.deleteMany({
            where: { utilisateurId: id }
        }).catch(() => { }); // Ignorer si n'existe pas
        return this.utilisateurRepo.delete(id);
    }
}
exports.UtilisateurService = UtilisateurService;
//# sourceMappingURL=UtilisateurService.js.map