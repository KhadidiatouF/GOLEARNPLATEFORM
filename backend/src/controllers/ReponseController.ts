import type { NextFunction, Request, Response } from "express";
import { ReponseService } from "../services/ReponseService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { reponseSchema } from "../validators/ReponseValidator";

const reponseService = new ReponseService();

export class ReponseController {
    static async getAllReponses(req: Request, res: Response, next: NextFunction) {
        try {
            const reponses = await reponseService.getAllReponses();
            if (reponses) {
                FormaterResponse.success(res, reponses, "Réponses récupérées avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Réponses non trouvées", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneReponse(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const reponse = await reponseService.getOneReponse(id);
            if (reponse) {
                FormaterResponse.success(res, reponse, "Réponse trouvée avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Réponse non trouvée", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async createReponse(req: Request, res: Response, next: NextFunction) {
        try {
            const data = reponseSchema.parse(req.body);
            const reponseC = await reponseService.createReponse(data);
            return FormaterResponse.success(res, reponseC, "Réponse créée avec succès", HttpCode.CREATED);
        } catch (error: any) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async updateReponse(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const data = reponseSchema.parse(req.body);
            const reponseU = await reponseService.updateReponse(id, data);
            if (reponseU) {
                FormaterResponse.success(res, reponseU, "Réponse modifiée avec succès", 200);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, "Réponse non trouvée", 404);
        }
    }

    static async deleteReponse(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await reponseService.deleteReponse(id);
            res.status(HttpCode.NO_CONTENT).send();
        } catch (error: any) {
            return FormaterResponse.failed(res, "Réponse non trouvée", 404);
        }
    }
}
