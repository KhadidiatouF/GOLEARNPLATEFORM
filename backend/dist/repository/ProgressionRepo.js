"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressionRepo = void 0;
const client_1 = require("@prisma/client");
class ProgressionRepo {
    prisma = new client_1.PrismaClient();
    // Créer une progression pour une inscription
    async createForApprenantFormation(apprenantFormationId) {
        return await this.prisma.progression.create({
            data: {
                apprenantFormationId
            }
        });
    }
    // Récupérer la progression par ID d'apprenant-formation
    async findByApprenantFormationId(apprenantFormationId) {
        return await this.prisma.progression.findUnique({
            where: { apprenantFormationId },
            include: {
                chapitresCompletes: {
                    include: { chapitre: true }
                }
            }
        });
    }
    // Marquer un chapitre comme complété
    async completeChapter(progressionId, chapitreId) {
        return await this.prisma.apprenantChapitre.upsert({
            where: {
                progressionId_chapitreId: {
                    progressionId,
                    chapitreId
                }
            },
            create: {
                progressionId,
                chapitreId,
                estComplete: true,
                dateCompletion: new Date()
            },
            update: {
                estComplete: true,
                dateCompletion: new Date()
            }
        });
    }
    // Marquer un chapitre comme non-complété
    async uncompleteChapter(progressionId, chapitreId) {
        await this.prisma.apprenantChapitre.deleteMany({
            where: {
                progressionId,
                chapitreId
            }
        });
    }
    // Calculer le pourcentage de progression
    async calculateProgression(progressionId, totalChapters) {
        if (totalChapters === 0)
            return 0;
        const completedCount = await this.prisma.apprenantChapitre.count({
            where: {
                progressionId,
                estComplete: true
            }
        });
        return Math.round((completedCount / totalChapters) * 100);
    }
    // Récupérer tous les apprenants avec leur progression pour un professeur
    // Filtre directement par les formations du professeur
    async findApprenantsByProfesseurId(professeurId) {
        // D'abord, récupérer les IDs des formations du professeur
        const formationsDuProf = await this.prisma.formation.findMany({
            where: { professeurId },
            select: { id: true }
        });
        const formationIds = formationsDuProf.map(f => f.id);
        if (formationIds.length === 0) {
            return [];
        }
        // Ensuite, récupérer les apprenants inscrits à ces formations
        return await this.prisma.apprenant.findMany({
            where: {
                utilisateur: {
                    role: 'APPRENANT'
                },
                formations: {
                    some: {
                        formationId: { in: formationIds }
                    }
                }
            },
            include: {
                utilisateur: true,
                formations: {
                    where: {
                        formationId: { in: formationIds }
                    },
                    include: {
                        formation: {
                            include: {
                                sessions: {
                                    include: {
                                        chapitres: true
                                    }
                                }
                            }
                        },
                        progression: {
                            include: {
                                chapitresCompletes: true
                            }
                        }
                    }
                }
            }
        });
    }
}
exports.ProgressionRepo = ProgressionRepo;
//# sourceMappingURL=ProgressionRepo.js.map