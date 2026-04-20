import type { NextFunction, Request, Response } from "express";
import { AdministrateurService } from "../services/AdministrateurService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { administrateurSchema } from "../validators/AdministrateurValidator";

const administrateurService = new AdministrateurService();

export class AdministrateurController {
    static async getAllAdministrateurs(req: Request, res: Response, next: NextFunction) {
        try {
            const administrateurs = await administrateurService.getAllAdministrateurs();
            if (administrateurs) {
                FormaterResponse.success(res, administrateurs, "Administrateurs récupérés avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Administrateurs non trouvés", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneAdministrateur(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const administrateur = await administrateurService.getOneAdministrateur(id);
            if (administrateur) {
                FormaterResponse.success(res, administrateur, "Administrateur trouvé avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Administrateur non trouvé", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async createAdministrateur(req: Request, res: Response, next: NextFunction) {
        try {
            const data = administrateurSchema.parse(req.body);
            const administrateurC = await administrateurService.createAdministrateur(data);
            return FormaterResponse.success(res, administrateurC, "Administrateur créé avec succès", HttpCode.CREATED);
        } catch (error: any) {
            if (error.code === "P2002") {
                return FormaterResponse.failed(res, "L'administrateur existe déjà", HttpCode.CONFLICT);
            }
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async updateAdministrateur(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const data = administrateurSchema.parse(req.body);
            const administrateurU = await administrateurService.updateAdministrateur(id, data);
            if (administrateurU) {
                FormaterResponse.success(res, administrateurU, "Administrateur modifié avec succès", 200);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, "Administrateur non trouvé", 404);
        }
    }

    static async deleteAdministrateur(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await administrateurService.deleteAdministrateur(id);
            res.status(HttpCode.NO_CONTENT).send();
        } catch (error: any) {
            return FormaterResponse.failed(res, "Administrateur non trouvé", 404);
        }
    }

    static async getStatistics(req: Request, res: Response, next: NextFunction) {
        try {
            const statistics = await administrateurService.getStatistics();
            FormaterResponse.success(res, statistics, "Statistiques récupérées avec succès", HttpCode.OK);
        } catch (error) {
            next(error);
        }
    }

    static async getRevenueHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const historique = await administrateurService.getRevenueHistory();
            FormaterResponse.success(res, historique, "Historique des revenus récupéré avec succès", HttpCode.OK);
        } catch (error) {
            next(error);
        }
    }
}
