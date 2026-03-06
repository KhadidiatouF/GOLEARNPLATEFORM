import type { NextFunction, Request, Response } from "express";
import { SessionService } from "../services/SessionService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { sessionSchema } from "../validators/SessionValidator";

const sessionService = new SessionService();

export class SessionController {
    static async getAllSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const sessions = await sessionService.getAllSessions();
            if (sessions) {
                FormaterResponse.success(res, sessions, "Sessions récupérées avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Sessions non trouvées", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneSession(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const session = await sessionService.getOneSession(id);
            if (session) {
                FormaterResponse.success(res, session, "Session trouvée avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Session non trouvée", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async createSession(req: Request, res: Response, next: NextFunction) {
        try {
            const data = sessionSchema.parse(req.body);
            const sessionC = await sessionService.createSession(data);
            return FormaterResponse.success(res, sessionC, "Session créée avec succès", HttpCode.CREATED);
        } catch (error: any) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async updateSession(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const data = sessionSchema.parse(req.body);
            const sessionU = await sessionService.updateSession(id, data);
            if (sessionU) {
                FormaterResponse.success(res, sessionU, "Session modifiée avec succès", 200);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, "Session non trouvée", 404);
        }
    }

    static async deleteSession(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await sessionService.deleteSession(id);
            res.status(HttpCode.NO_CONTENT).send();
        } catch (error: any) {
            return FormaterResponse.failed(res, "Session non trouvée", 404);
        }
    }
}
