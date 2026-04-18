"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressionService = void 0;
const ProgressionRepo_1 = require("../repository/ProgressionRepo");
class ProgressionService {
    progressionRepo = new ProgressionRepo_1.ProgressionRepo();
    // Créer une progression pour une nouvelle inscription
    async createProgression(apprenantFormationId) {
        return await this.progressionRepo.createForApprenantFormation(apprenantFormationId);
    }
    // Récupérer la progression d'un apprenant pour une formation
    async getProgression(apprenantFormationId) {
        const progression = await this.progressionRepo.findByApprenantFormationId(apprenantFormationId);
        if (!progression) {
            return null;
        }
        // Calculer le pourcentage
        const completedCount = progression.chapitresCompletes?.length || 0;
        return {
            ...progression,
            completedChapters: completedCount,
            percentage: 0
        };
    }
    // Marquer un chapitre comme complété
    async completeChapter(apprenantFormationId, chapitreId) {
        const progression = await this.progressionRepo.findByApprenantFormationId(apprenantFormationId);
        if (!progression) {
            throw new Error("Progression non trouvée pour cette inscription");
        }
        return await this.progressionRepo.completeChapter(progression.id, chapitreId);
    }
    // Marquer un chapitre comme non-complété
    async uncompleteChapter(apprenantFormationId, chapitreId) {
        const progression = await this.progressionRepo.findByApprenantFormationId(apprenantFormationId);
        if (!progression) {
            throw new Error("Progression non trouvée pour cette inscription");
        }
        return await this.progressionRepo.uncompleteChapter(progression.id, chapitreId);
    }
    // Récupérer les progressions pour un professeur
    async getProgressionByProfesseur(professeurId) {
        const apprenantsData = await this.progressionRepo.findApprenantsByProfesseurId(professeurId);
        const result = [];
        for (const apprenant of apprenantsData) {
            for (const enrollment of apprenant.formations || []) {
                if (enrollment.formation && enrollment.formation.professeurId === professeurId) {
                    let totalChapters = 0;
                    let completedChapters = 0;
                    for (const session of enrollment.formation.sessions || []) {
                        totalChapters += (session.chapitres || []).length;
                    }
                    if (enrollment.progression) {
                        completedChapters = enrollment.progression.chapitresCompletes?.length || 0;
                    }
                    const percentage = totalChapters > 0
                        ? Math.round((completedChapters / totalChapters) * 100)
                        : 0;
                    result.push({
                        apprenant: {
                            id: apprenant.id,
                            name: `${apprenant.utilisateur?.prenom || ''} ${apprenant.utilisateur?.nom || ''}`.trim()
                        },
                        formation: {
                            id: enrollment.formation.id,
                            titre: enrollment.formation.titre
                        },
                        progression: {
                            completedChapters,
                            totalChapters,
                            percentage
                        }
                    });
                }
            }
        }
        return result;
    }
}
exports.ProgressionService = ProgressionService;
//# sourceMappingURL=ProgressionService.js.map