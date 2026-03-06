import type { NextFunction, Request, Response } from "express";
import { CertificationService } from "../services/CertificationService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { certificationSchema } from "../validators/CertificationValidator";

const certificationService = new CertificationService();

export class CertificationController {
    static async getAllCertifications(req: Request, res: Response, next: NextFunction) {
        try {
            const certifications = await certificationService.getAllCertifications();
            if (certifications) {
                FormaterResponse.success(res, certifications, "Certifications récupérées avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Certifications non trouvées", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneCertification(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const certification = await certificationService.getOneCertification(id);
            if (certification) {
                FormaterResponse.success(res, certification, "Certification trouvée avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Certification non trouvée", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async createCertification(req: Request, res: Response, next: NextFunction) {
        try {
            const data = certificationSchema.parse(req.body);
            const certificationC = await certificationService.createCertification(data);
            return FormaterResponse.success(res, certificationC, "Certification créée avec succès", HttpCode.CREATED);
        } catch (error: any) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async deleteCertification(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await certificationService.deleteCertification(id);
            res.status(HttpCode.NO_CONTENT).send();
        } catch (error: any) {
            return FormaterResponse.failed(res, "Certification non trouvée", 404);
        }
    }
}
