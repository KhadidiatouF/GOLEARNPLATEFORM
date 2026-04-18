"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprenantController = void 0;
const ApprenantService_1 = require("../services/ApprenantService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const ApprenantValidator_1 = require("../validators/ApprenantValidator");
const apprenantService = new ApprenantService_1.ApprenantService();
class ApprenantController {
    static async getAllApprenants(req, res, next) {
        try {
            const apprenants = await apprenantService.getAllApprenants();
            if (apprenants) {
                formateReponse_1.FormaterResponse.success(res, apprenants, "Apprenants récupérés avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Apprenants non trouvés", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneApprenant(req, res, next) {
        try {
            const id = Number(req.params.id);
            const apprenant = await apprenantService.getOneApprenant(id);
            if (apprenant) {
                formateReponse_1.FormaterResponse.success(res, apprenant, "Apprenant trouvé avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Apprenant non trouvé", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createApprenant(req, res, next) {
        try {
            const data = ApprenantValidator_1.apprenantSchema.parse(req.body);
            const apprenantC = await apprenantService.createApprenant(data);
            return formateReponse_1.FormaterResponse.success(res, apprenantC, "Apprenant créé avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error.code === "P2002") {
                return formateReponse_1.FormaterResponse.failed(res, "L'apprenant existe déjà", codeError_1.HttpCode.CONFLICT);
            }
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateApprenant(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = ApprenantValidator_1.apprenantSchema.parse(req.body);
            const apprenantU = await apprenantService.updateApprenant(id, data);
            if (apprenantU) {
                formateReponse_1.FormaterResponse.success(res, apprenantU, "Apprenant modifié avec succès", 200);
            }
        }
        catch (error) {
            return (formateReponse_1.FormaterResponse.failed(res, "Apprenant non trouvé", 404));
        }
    }
    static async deleteApprenant(req, res) {
        try {
            const id = Number(req.params.id);
            await apprenantService.deleteApprenant(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return (formateReponse_1.FormaterResponse.failed(res, "Apprenant non trouvé", 404));
        }
    }
}
exports.ApprenantController = ApprenantController;
//# sourceMappingURL=ApprenantController.js.map