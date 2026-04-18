"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministrateurController = void 0;
const AdministrateurService_1 = require("../services/AdministrateurService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const AdministrateurValidator_1 = require("../validators/AdministrateurValidator");
const administrateurService = new AdministrateurService_1.AdministrateurService();
class AdministrateurController {
    static async getAllAdministrateurs(req, res, next) {
        try {
            const administrateurs = await administrateurService.getAllAdministrateurs();
            if (administrateurs) {
                formateReponse_1.FormaterResponse.success(res, administrateurs, "Administrateurs récupérés avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Administrateurs non trouvés", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneAdministrateur(req, res, next) {
        try {
            const id = Number(req.params.id);
            const administrateur = await administrateurService.getOneAdministrateur(id);
            if (administrateur) {
                formateReponse_1.FormaterResponse.success(res, administrateur, "Administrateur trouvé avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Administrateur non trouvé", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createAdministrateur(req, res, next) {
        try {
            const data = AdministrateurValidator_1.administrateurSchema.parse(req.body);
            const administrateurC = await administrateurService.createAdministrateur(data);
            return formateReponse_1.FormaterResponse.success(res, administrateurC, "Administrateur créé avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error.code === "P2002") {
                return formateReponse_1.FormaterResponse.failed(res, "L'administrateur existe déjà", codeError_1.HttpCode.CONFLICT);
            }
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateAdministrateur(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = AdministrateurValidator_1.administrateurSchema.parse(req.body);
            const administrateurU = await administrateurService.updateAdministrateur(id, data);
            if (administrateurU) {
                formateReponse_1.FormaterResponse.success(res, administrateurU, "Administrateur modifié avec succès", 200);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Administrateur non trouvé", 404);
        }
    }
    static async deleteAdministrateur(req, res) {
        try {
            const id = Number(req.params.id);
            await administrateurService.deleteAdministrateur(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Administrateur non trouvé", 404);
        }
    }
    static async getStatistics(req, res, next) {
        try {
            const statistics = await administrateurService.getStatistics();
            formateReponse_1.FormaterResponse.success(res, statistics, "Statistiques récupérées avec succès", codeError_1.HttpCode.OK);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdministrateurController = AdministrateurController;
//# sourceMappingURL=AdministrateurController.js.map