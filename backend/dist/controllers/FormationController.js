"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationController = void 0;
const FormationService_1 = require("../services/FormationService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const FormationValidator_1 = require("../validators/FormationValidator");
const formationService = new FormationService_1.FormationService();
class FormationController {
    // Endpoint public - Retourne uniquement les formations validées (sans authentification)
    static async getFormationsPubliques(req, res, next) {
        try {
            const formations = await formationService.getFormationsPubliques();
            if (formations) {
                formateReponse_1.FormaterResponse.success(res, formations, "Formations publiques récupérées avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Aucune formation disponible", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllFormations(req, res, next) {
        try {
            // Récupérer le contexte utilisateur depuis req.user
            const user = req.user;
            let formations;
            if (user) {
                const userContext = {
                    id: user.id,
                    role: user.role,
                    professeurId: user.professeurId
                };
                formations = await formationService.getFormations(userContext);
            }
            else {
                // Sans authentification, retourner toutes les formations
                formations = await formationService.getAllFormations();
            }
            if (formations) {
                formateReponse_1.FormaterResponse.success(res, formations, "Formations récupérées avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Formations non trouvées", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneFormation(req, res, next) {
        try {
            const id = Number(req.params.id);
            const formation = await formationService.getOneFormation(id);
            if (formation) {
                formateReponse_1.FormaterResponse.success(res, formation, "Formation trouvée avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Formation non trouvée", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createFormation(req, res, next) {
        try {
            const data = FormationValidator_1.formationSchema.parse(req.body);
            const formationC = await formationService.createFormation(data);
            return formateReponse_1.FormaterResponse.success(res, formationC, "Formation créée avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error.code === "P2002") {
                return formateReponse_1.FormaterResponse.failed(res, "La formation existe déjà", codeError_1.HttpCode.CONFLICT);
            }
            if (error instanceof zod_1.ZodError) {
                console.log('ERREUR VALIDATION ZOD:', JSON.stringify(error.issues, null, 2)); // ✅ Ajoutez cette ligne
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateFormation(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = FormationValidator_1.formationSchema.parse(req.body);
            const formationU = await formationService.updateFormation(id, data);
            if (formationU) {
                formateReponse_1.FormaterResponse.success(res, formationU, "Formation modifiée avec succès", 200);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Formation non trouvée", 404);
        }
    }
    static async deleteFormation(req, res) {
        try {
            const id = Number(req.params.id);
            await formationService.deleteFormation(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Formation non trouvée", 404);
        }
    }
    /**
     * CRÉATION COMPLÈTE D'UNE FORMATION
     *
     * Crée une formation avec sessions, quiz, questions et réponses
     * en une seule requête avec transaction SQL
     */
    static async createCompleteFormation(req, res, next) {
        try {
            const data = FormationValidator_1.completeFormationSchema.parse(req.body);
            const formation = await formationService.createCompleteFormation(data);
            return formateReponse_1.FormaterResponse.success(res, formation, "Formation complète créée avec succès. En attente de validation par l'administrateur.", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            console.log('❌ ERREUR CREATE FORMATION:', error);
            if (error.code === "P2002") {
                return formateReponse_1.FormaterResponse.failed(res, "La formation existe déjà", codeError_1.HttpCode.CONFLICT);
            }
            if (error instanceof zod_1.ZodError) {
                console.log('❌ ERREUR VALIDATION ZOD:', JSON.stringify(error.issues, null, 2));
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    // Valider une formation (action admin)
    static async validerFormation(req, res, next) {
        try {
            const id = Number(req.params.id);
            console.log('Validation formation ID:', id);
            const formation = await formationService.validerFormation(id);
            console.log('Formation mise à jour:', formation);
            if (formation) {
                formateReponse_1.FormaterResponse.success(res, formation, "Formation validée avec succès", codeError_1.HttpCode.OK);
            }
        }
        catch (error) {
            console.error('ERREUR PRISMA:', error);
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la validation", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    // Rejeter une formation (action admin)
    static async rejeterFormation(req, res, next) {
        try {
            const id = Number(req.params.id);
            const formation = await formationService.rejeterFormation(id);
            if (formation) {
                formateReponse_1.FormaterResponse.success(res, formation, "Formation rejetée avec succès", codeError_1.HttpCode.OK);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors du rejet", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    // Récupérer les formations en attente de validation
    static async getFormationsEnAttente(req, res, next) {
        try {
            const formations = await formationService.getFormationsEnAttente();
            formateReponse_1.FormaterResponse.success(res, formations, "Formations en attente de validation", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.FormationController = FormationController;
//# sourceMappingURL=FormationController.js.map