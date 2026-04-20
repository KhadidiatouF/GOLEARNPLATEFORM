import type { NextFunction, Request, Response } from "express";
import { FormationService, UserContext } from "../services/FormationService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { formationSchema, completeFormationSchema } from "../validators/FormationValidator";
import { Role } from "@prisma/client";

const formationService = new FormationService();

export class FormationController {
    // Endpoint public - Retourne uniquement les formations validées (sans authentification)
    static async getFormationsPubliques(req: Request, res: Response, next: NextFunction) {
        try {
            const formations = await formationService.getFormationsPubliques();
            if (formations) {
                FormaterResponse.success(res, formations, "Formations publiques récupérées avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Aucune formation disponible", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getAllFormations(req: Request & { user?: { id: number; email: string; role: Role; professeurId?: number } }, res: Response, next: NextFunction) {
        try {
            // Récupérer le contexte utilisateur depuis req.user
            const user = req.user;
            
            let formations;
            if (user) {
                const userContext: UserContext = {
                    id: user.id,
                    role: user.role,
                    professeurId: user.professeurId
                };
                formations = await formationService.getFormations(userContext);
            } else {
                // Sans authentification, retourner toutes les formations
                formations = await formationService.getAllFormations();
            }
            
            if (formations) {
                FormaterResponse.success(res, formations, "Formations récupérées avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Formations non trouvées", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneFormation(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const formation = await formationService.getOneFormation(id);
            if (formation) {
                FormaterResponse.success(res, formation, "Formation trouvée avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Formation non trouvée", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async createFormation(req: Request, res: Response, next: NextFunction) {
        try {
            const data = formationSchema.parse(req.body);
            const formationC = await formationService.createFormation(data);
            return FormaterResponse.success(res, formationC, "Formation créée avec succès", HttpCode.CREATED);
        } catch (error: any) {
            if (error.code === "P2002") {
                return FormaterResponse.failed(res, "La formation existe déjà", HttpCode.CONFLICT);
            }
            if (error instanceof ZodError) {
                console.log('ERREUR VALIDATION ZOD:', JSON.stringify(error.issues, null, 2)); // ✅ Ajoutez cette ligne
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async updateFormation(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const data = formationSchema.parse(req.body);
            const formationU = await formationService.updateFormation(id, data);
            if (formationU) {
                FormaterResponse.success(res, formationU, "Formation modifiée avec succès", 200);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, "Formation non trouvée", 404);
        }
    }

    static async deleteFormation(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await formationService.deleteFormation(id);
            res.status(HttpCode.NO_CONTENT).send();
        } catch (error: any) {
            const message = error?.message || "Erreur lors de la suppression de la formation";
            const statusCode = message === "Formation non trouvée" ? 404 : HttpCode.INTERNAL_SERVER_ERROR;
            return FormaterResponse.failed(res, message, statusCode);
        }
    }

    /**
     * CRÉATION COMPLÈTE D'UNE FORMATION
     * 
     * Crée une formation avec sessions, quiz, questions et réponses
     * en une seule requête avec transaction SQL
     */
    static async createCompleteFormation(req: Request, res: Response, next: NextFunction) {
        try {
            const data = completeFormationSchema.parse(req.body);
            const formation = await formationService.createCompleteFormation(data);
            return FormaterResponse.success(res, formation, "Formation complète créée avec succès. En attente de validation par l'administrateur.", HttpCode.CREATED);
        } catch (error: any) {
            console.log('❌ ERREUR CREATE FORMATION:', error);
            
            if (error.code === "P2002") {
                return FormaterResponse.failed(res, "La formation existe déjà", HttpCode.CONFLICT);
            }
            if (error instanceof ZodError) {
                console.log('❌ ERREUR VALIDATION ZOD:', JSON.stringify(error.issues, null, 2));
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, error.message || "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Valider une formation (action admin)
    static async validerFormation(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            console.log('Validation formation ID:', id);
            const formation = await formationService.validerFormation(id);
            console.log('Formation mise à jour:', formation);
            if (formation) {
                FormaterResponse.success(res, formation, "Formation validée avec succès", HttpCode.OK);
            }
        } catch (error: any) {
            console.error('ERREUR PRISMA:', error);
            return FormaterResponse.failed(res, error.message || "Erreur lors de la validation", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Rejeter une formation (action admin)
    static async rejeterFormation(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const formation = await formationService.rejeterFormation(id);
            if (formation) {
                FormaterResponse.success(res, formation, "Formation rejetée avec succès", HttpCode.OK);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors du rejet", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Récupérer les formations en attente de validation
    static async getFormationsEnAttente(req: Request, res: Response, next: NextFunction) {
        try {
            const formations = await formationService.getFormationsEnAttente();
            FormaterResponse.success(res, formations, "Formations en attente de validation", HttpCode.OK);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
