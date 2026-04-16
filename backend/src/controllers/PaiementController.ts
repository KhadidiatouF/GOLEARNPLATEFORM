import type { NextFunction, Request, Response } from "express";
import { PaiementService } from "../services/PaiementService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { paiementSchema } from "../validators/PaiementValidator";

const paiementService = new PaiementService();

export class PaiementController {
    static async getAllPaiements(req: Request, res: Response, next: NextFunction) {
        try {
            const paiements = await paiementService.getAllPaiements();
            if (paiements) {
                FormaterResponse.success(res, paiements, "Paiements récupérés avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Paiements non trouvés", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOnePaiement(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const paiement = await paiementService.getOnePaiement(id);
            if (paiement) {
                FormaterResponse.success(res, paiement, "Paiement trouvé avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Paiement non trouvé", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async createPaiement(req: Request, res: Response, next: NextFunction) {
        try {
            const data = paiementSchema.parse(req.body);
            const paiementC = await paiementService.createPaiement(data);
            return FormaterResponse.success(res, paiementC, "Paiement créé avec succès", HttpCode.CREATED);
        } catch (error: any) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async updatePaiement(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const data = paiementSchema.parse(req.body);
            const paiementU = await paiementService.updatePaiement(id, data);
            if (paiementU) {
                FormaterResponse.success(res, paiementU, "Paiement modifié avec succès", 200);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, "Paiement non trouvé", 404);
        }
    }

    static async deletePaiement(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await paiementService.deletePaiement(id);
            res.status(HttpCode.NO_CONTENT).send();
        } catch (error: any) {
            return FormaterResponse.failed(res, "Paiement non trouvé", 404);
        }
    }

    static async webhookConfirmation(req: Request, res: Response) {
        try {
            // Appeler le service pour traiter la confirmation de paiement
            await paiementService.confirmPaiement(req.body);
            
            // Orange Money attend obligatoirement un statut 200 OK
            return res.status(200).send('OK');
        } catch (error: any) {
            // Même en cas d'erreur on retourne 200 pour éviter que Orange réessaye indéfiniment
            return res.status(200).send('OK');
        }
    }
}
