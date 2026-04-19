"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessController = void 0;
const ProfesseurService_1 = require("../services/ProfesseurService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const ProfesseurValidator_1 = require("../validators/ProfesseurValidator");
const professeurService = new ProfesseurService_1.ProfesseurService();
class ProfessController {
    static async getAllProfesseurs(req, res, next) {
        try {
            const professeurs = await professeurService.getAllProfesseurs();
            if (professeurs) {
                formateReponse_1.FormaterResponse.success(res, professeurs, "Professeurs récupérés avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Professeurs non trouvés", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneProfesseur(req, res, next) {
        try {
            const id = Number(req.params.id);
            const professeur = await professeurService.getOneProfesseur(id);
            if (professeur) {
                formateReponse_1.FormaterResponse.success(res, professeur, "Professeur trouvé avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Professeur non trouvé", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createProfesseur(req, res, next) {
        try {
            const data = ProfesseurValidator_1.professeurSchema.parse(req.body);
            const professeurC = await professeurService.createProfesseur(data);
            // Le professeur est créé avec le statut EN_ATTENTE par défaut
            return formateReponse_1.FormaterResponse.success(res, professeurC, "Demande de professeur soumise avec succès. En attente de validation par l'administrateur.", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error.code === "P2002") {
                return formateReponse_1.FormaterResponse.failed(res, "Le professeur existe déjà", codeError_1.HttpCode.CONFLICT);
            }
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async createDemandeProfesseur(req, res) {
        try {
            const data = ProfesseurValidator_1.demandeProfesseurSchema.parse(req.body);
            const utilisateurId = req.user?.id;
            const demande = await professeurService.createDemandeProfesseur(data, utilisateurId);
            return formateReponse_1.FormaterResponse.success(res, demande, "Demande de professeur soumise avec succes. Elle sera examinee par un administrateur.", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la soumission de la demande", codeError_1.HttpCode.BAD_REQUEST);
        }
    }
    static async getAllDemandesProfesseur(req, res) {
        try {
            const demandes = await professeurService.getAllDemandesProfesseur();
            return formateReponse_1.FormaterResponse.success(res, demandes, "Demandes recuperes avec succes", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateProfesseur(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = ProfesseurValidator_1.professeurSchema.parse(req.body);
            const professeurU = await professeurService.updateProfesseur(id, data);
            if (professeurU) {
                formateReponse_1.FormaterResponse.success(res, professeurU, "Professeur modifié avec succès", 200);
            }
        }
        catch (error) {
            return (formateReponse_1.FormaterResponse.failed(res, "Professeur non trouvé", 404));
        }
    }
    static async deleteProfesseur(req, res) {
        try {
            const id = Number(req.params.id);
            await professeurService.deleteProfesseur(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return (formateReponse_1.FormaterResponse.failed(res, "Professeur non trouvé", 404));
        }
    }
    // Valider un professeur (action admin)
    static async validerProfesseur(req, res, next) {
        try {
            const id = Number(req.params.id);
            const professeur = await professeurService.validerProfesseur(id);
            if (professeur) {
                formateReponse_1.FormaterResponse.success(res, professeur, "Professeur validé avec succès", codeError_1.HttpCode.OK);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la validation", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    // Rejeter un professeur (action admin)
    static async rejeterProfesseur(req, res, next) {
        try {
            const id = Number(req.params.id);
            const professeur = await professeurService.rejeterProfesseur(id);
            if (professeur) {
                formateReponse_1.FormaterResponse.success(res, professeur, "Professeur rejeté avec succès", codeError_1.HttpCode.OK);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors du rejet", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    // Récupérer les demandes de professeur en attente
    static async getDemandesEnAttente(req, res, next) {
        try {
            const demandes = await professeurService.getDemandesProfesseurEnAttente();
            formateReponse_1.FormaterResponse.success(res, demandes, "Demandes de professeur en attente", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async validerDemandeProfesseur(req, res) {
        try {
            const id = Number(req.params.id);
            const demande = await professeurService.validerDemandeProfesseur(id);
            return formateReponse_1.FormaterResponse.success(res, demande, "Demande approuvee, compte professeur cree et email envoye avec succes.", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de l'approbation", codeError_1.HttpCode.BAD_REQUEST);
        }
    }
    static async rejeterDemandeProfesseur(req, res) {
        try {
            const id = Number(req.params.id);
            const demande = await professeurService.rejeterDemandeProfesseur(id);
            return formateReponse_1.FormaterResponse.success(res, demande, "Demande de professeur rejetee avec succes.", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors du rejet", codeError_1.HttpCode.BAD_REQUEST);
        }
    }
    static async getHistoriqueRevenus(req, res) {
        try {
            const professeurId = req.user?.professeurId;
            if (!professeurId) {
                return formateReponse_1.FormaterResponse.failed(res, "Professeur non trouve", codeError_1.HttpCode.BAD_REQUEST);
            }
            const historique = await professeurService.getHistoriqueRevenus(professeurId);
            return formateReponse_1.FormaterResponse.success(res, historique, "Historique des revenus recupere avec succes", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.ProfessController = ProfessController;
//# sourceMappingURL=ProfesseurController.js.map