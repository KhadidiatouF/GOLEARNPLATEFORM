"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiementController = void 0;
const PaiementService_1 = require("../services/PaiementService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const PaiementValidator_1 = require("../validators/PaiementValidator");
const paiementService = new PaiementService_1.PaiementService();
class PaiementController {
    static async getAllPaiements(req, res, next) {
        try {
            const paiements = await paiementService.getAllPaiements();
            if (paiements) {
                formateReponse_1.FormaterResponse.success(res, paiements, "Paiements récupérés avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Paiements non trouvés", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOnePaiement(req, res, next) {
        try {
            const id = Number(req.params.id);
            const paiement = await paiementService.getOnePaiement(id);
            if (paiement) {
                formateReponse_1.FormaterResponse.success(res, paiement, "Paiement trouvé avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Paiement non trouvé", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createPaiement(req, res, next) {
        try {
            const data = PaiementValidator_1.paiementSchema.parse(req.body);
            const utilisateurId = req.user?.id;
            if (!utilisateurId) {
                return formateReponse_1.FormaterResponse.failed(res, "Utilisateur non autorise", codeError_1.HttpCode.UNAUTHORIZED);
            }
            const paiementC = await paiementService.createPaiement(data, utilisateurId);
            return formateReponse_1.FormaterResponse.success(res, paiementC, "Paiement créé avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updatePaiement(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = PaiementValidator_1.updatePaiementSchema.parse(req.body);
            const paiementU = await paiementService.updatePaiement(id, data);
            if (paiementU) {
                formateReponse_1.FormaterResponse.success(res, paiementU, "Paiement modifié avec succès", 200);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Paiement non trouvé", 404);
        }
    }
    static async deletePaiement(req, res) {
        try {
            const id = Number(req.params.id);
            await paiementService.deletePaiement(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Paiement non trouvé", 404);
        }
    }
    static async webhookConfirmation(req, res) {
        try {
            // Appeler le service pour traiter la confirmation de paiement
            await paiementService.confirmPaiement(req.body);
            // Orange Money attend obligatoirement un statut 200 OK
            return res.status(200).send('OK');
        }
        catch (error) {
            // Même en cas d'erreur on retourne 200 pour éviter que Orange réessaye indéfiniment
            return res.status(200).send('OK');
        }
    }
}
exports.PaiementController = PaiementController;
//# sourceMappingURL=PaiementController.js.map