"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const SessionService_1 = require("../services/SessionService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const SessionValidator_1 = require("../validators/SessionValidator");
const sessionService = new SessionService_1.SessionService();
class SessionController {
    static async getAllSessions(req, res, next) {
        try {
            const sessions = await sessionService.getAllSessions();
            if (sessions) {
                formateReponse_1.FormaterResponse.success(res, sessions, "Sessions récupérées avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Sessions non trouvées", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneSession(req, res, next) {
        try {
            const id = Number(req.params.id);
            const session = await sessionService.getOneSession(id);
            if (session) {
                formateReponse_1.FormaterResponse.success(res, session, "Session trouvée avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Session non trouvée", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createSession(req, res, next) {
        try {
            const data = SessionValidator_1.sessionSchema.parse(req.body);
            const sessionC = await sessionService.createSession(data);
            return formateReponse_1.FormaterResponse.success(res, sessionC, "Session créée avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateSession(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = SessionValidator_1.sessionSchema.parse(req.body);
            const sessionU = await sessionService.updateSession(id, data);
            if (sessionU) {
                formateReponse_1.FormaterResponse.success(res, sessionU, "Session modifiée avec succès", 200);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Session non trouvée", 404);
        }
    }
    static async deleteSession(req, res) {
        try {
            const id = Number(req.params.id);
            await sessionService.deleteSession(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Session non trouvée", 404);
        }
    }
}
exports.SessionController = SessionController;
//# sourceMappingURL=SessionController.js.map