"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressionController = void 0;
const ProgressionService_1 = require("../services/ProgressionService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const progressionService = new ProgressionService_1.ProgressionService();
class ProgressionController {
    // Créer une progression pour une inscription
    static async createProgression(req, res, next) {
        try {
            const { apprenantFormationId } = req.body;
            const progression = await progressionService.createProgression(apprenantFormationId);
            return formateReponse_1.FormaterResponse.success(res, progression, "Progression créée avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la création", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    // Récupérer la progression d'un apprenant pour une formation
    static async getProgression(req, res, next) {
        try {
            const apprenantFormationId = Number(req.params.apprenantFormationId);
            const progression = await progressionService.getProgression(apprenantFormationId);
            if (!progression) {
                return formateReponse_1.FormaterResponse.failed(res, "Progression non trouvée", codeError_1.HttpCode.NOT_FOUND);
            }
            return formateReponse_1.FormaterResponse.success(res, progression, "Progression récupérée avec succès", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    // Marquer un chapitre comme complété
    static async completeChapter(req, res, next) {
        try {
            const { apprenantFormationId, chapitreId } = req.body;
            const result = await progressionService.completeChapter(apprenantFormationId, chapitreId);
            return formateReponse_1.FormaterResponse.success(res, result, "Chapitre marqué comme complété", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la mise à jour", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    // Récupérer toutes les progressions pour un professeur
    static async getProgressionByProfesseur(req, res, next) {
        try {
            const professeurId = req.user?.professeurId;
            if (!professeurId) {
                return formateReponse_1.FormaterResponse.failed(res, "Professeur non trouvé", codeError_1.HttpCode.BAD_REQUEST);
            }
            const progressions = await progressionService.getProgressionByProfesseur(professeurId);
            return formateReponse_1.FormaterResponse.success(res, progressions, "Progression récupérée avec succès", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.ProgressionController = ProgressionController;
//# sourceMappingURL=ProgressionController.js.map