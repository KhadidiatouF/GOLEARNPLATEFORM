"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReponseController = void 0;
const ReponseService_1 = require("../services/ReponseService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const ReponseValidator_1 = require("../validators/ReponseValidator");
const reponseService = new ReponseService_1.ReponseService();
class ReponseController {
    static async getAllReponses(req, res, next) {
        try {
            const reponses = await reponseService.getAllReponses();
            if (reponses) {
                formateReponse_1.FormaterResponse.success(res, reponses, "Réponses récupérées avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Réponses non trouvées", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneReponse(req, res, next) {
        try {
            const id = Number(req.params.id);
            const reponse = await reponseService.getOneReponse(id);
            if (reponse) {
                formateReponse_1.FormaterResponse.success(res, reponse, "Réponse trouvée avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Réponse non trouvée", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createReponse(req, res, next) {
        try {
            const data = ReponseValidator_1.reponseSchema.parse(req.body);
            const reponseC = await reponseService.createReponse(data);
            return formateReponse_1.FormaterResponse.success(res, reponseC, "Réponse créée avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateReponse(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = ReponseValidator_1.reponseSchema.parse(req.body);
            const reponseU = await reponseService.updateReponse(id, data);
            if (reponseU) {
                formateReponse_1.FormaterResponse.success(res, reponseU, "Réponse modifiée avec succès", 200);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Réponse non trouvée", 404);
        }
    }
    static async deleteReponse(req, res) {
        try {
            const id = Number(req.params.id);
            await reponseService.deleteReponse(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Réponse non trouvée", 404);
        }
    }
}
exports.ReponseController = ReponseController;
//# sourceMappingURL=ReponseController.js.map