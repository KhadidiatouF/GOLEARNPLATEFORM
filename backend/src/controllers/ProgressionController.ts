import type { NextFunction, Request, Response } from "express";
import { ProgressionService } from "../services/ProgressionService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";

const progressionService = new ProgressionService();

export class ProgressionController {
    
    // Créer une progression pour une inscription
    static async createProgression(req: Request, res: Response, next: NextFunction) {
        try {
            const { apprenantFormationId } = req.body;
            const progression = await progressionService.createProgression(apprenantFormationId);
            return FormaterResponse.success(res, progression, "Progression créée avec succès", HttpCode.CREATED);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors de la création", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Récupérer la progression d'un apprenant pour une formation
    static async getProgression(req: Request, res: Response, next: NextFunction) {
        try {
            const apprenantFormationId = Number(req.params.apprenantFormationId);
            const progression = await progressionService.getProgression(apprenantFormationId);
            
            if (!progression) {
                return FormaterResponse.failed(res, "Progression non trouvée", HttpCode.NOT_FOUND);
            }
            
            return FormaterResponse.success(res, progression, "Progression récupérée avec succès", HttpCode.OK);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Marquer un chapitre comme complété
    static async completeChapter(req: Request, res: Response, next: NextFunction) {
        try {
            const { apprenantFormationId, chapitreId } = req.body;
            const result = await progressionService.completeChapter(apprenantFormationId, chapitreId);
            return FormaterResponse.success(res, result, "Chapitre marqué comme complété", HttpCode.OK);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors de la mise à jour", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Récupérer toutes les progressions pour un professeur
    static async getProgressionByProfesseur(req: Request & { user?: any }, res: Response, next: NextFunction) {
        try {
            const professeurId = req.user?.professeurId;
            
            if (!professeurId) {
                return FormaterResponse.failed(res, "Professeur non trouvé", HttpCode.BAD_REQUEST);
            }
            
            const progressions = await progressionService.getProgressionByProfesseur(professeurId);
            return FormaterResponse.success(res, progressions, "Progression récupérée avec succès", HttpCode.OK);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
