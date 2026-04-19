"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationController = void 0;
const CertificationService_1 = require("../services/CertificationService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const CertificationValidator_1 = require("../validators/CertificationValidator");
const certificationService = new CertificationService_1.CertificationService();
class CertificationController {
    static async getAdminCertifications(req, res) {
        try {
            const role = req.user?.role;
            if (role !== client_1.Role.ADMIN) {
                return formateReponse_1.FormaterResponse.failed(res, "Accès refusé", codeError_1.HttpCode.FORBIDDEN);
            }
            const certifications = await certificationService.getAllCertificationsWithRelations();
            return formateReponse_1.FormaterResponse.success(res, certifications, "Certifications globales récupérées avec succès", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la récupération des certifications", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async getProfessorCertifications(req, res) {
        try {
            const role = req.user?.role;
            const professeurId = req.user?.professeurId;
            if (role !== client_1.Role.PROF) {
                return formateReponse_1.FormaterResponse.failed(res, "Accès refusé", codeError_1.HttpCode.FORBIDDEN);
            }
            if (!professeurId) {
                return formateReponse_1.FormaterResponse.failed(res, "Professeur introuvable", codeError_1.HttpCode.NOT_FOUND);
            }
            const certifications = await certificationService.getCertificationsByProfessorId(Number(professeurId));
            return formateReponse_1.FormaterResponse.success(res, certifications, "Certifications du professeur récupérées avec succès", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la récupération des certifications", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async getAllCertifications(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return formateReponse_1.FormaterResponse.failed(res, "Utilisateur non authentifié", codeError_1.HttpCode.UNAUTHORIZED);
            }
            // Récupérer l'apprenant correspondant à cet utilisateur
            const prisma = new client_1.PrismaClient();
            const apprenant = await prisma.apprenant.findFirst({
                where: { utilisateurId: Number(userId) }
            });
            if (!apprenant) {
                return formateReponse_1.FormaterResponse.success(res, { data: [], total: 0, page: 1, limit: 100 }, "Aucun certificat", codeError_1.HttpCode.OK);
            }
            // ✅ Seul les certificats de cet apprenant sont renvoyés
            const certifications = await certificationService.getCertificationsByApprenantId(apprenant.id);
            if (certifications) {
                formateReponse_1.FormaterResponse.success(res, certifications, "Certifications récupérées avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.success(res, { data: [], total: 0, page: 1, limit: 100 }, "Aucun certificat", codeError_1.HttpCode.OK);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneCertification(req, res, next) {
        try {
            const id = Number(req.params.id);
            const certification = await certificationService.getOneCertification(id);
            if (certification) {
                formateReponse_1.FormaterResponse.success(res, certification, "Certification trouvée avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Certification non trouvée", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createCertification(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return formateReponse_1.FormaterResponse.failed(res, "Utilisateur non authentifié", codeError_1.HttpCode.UNAUTHORIZED);
            }
            const formationId = Number(req.body?.formationId);
            if (!formationId || formationId <= 0) {
                return formateReponse_1.FormaterResponse.failed(res, "L'ID de la formation est requis", codeError_1.HttpCode.BAD_REQUEST);
            }
            const prisma = new client_1.PrismaClient();
            const apprenant = await prisma.apprenant.findFirst({
                where: { utilisateurId: Number(userId) }
            });
            if (!apprenant) {
                return formateReponse_1.FormaterResponse.failed(res, "Apprenant introuvable", codeError_1.HttpCode.NOT_FOUND);
            }
            const data = CertificationValidator_1.certificationSchema.parse({
                apprenantId: apprenant.id,
                formationId
            });
            const certificationC = await certificationService.createCertificationIfMissing(data.apprenantId, data.formationId);
            return formateReponse_1.FormaterResponse.success(res, certificationC, "Certification créée avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async deleteCertification(req, res) {
        try {
            const id = Number(req.params.id);
            await certificationService.deleteCertification(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Certification non trouvée", 404);
        }
    }
}
exports.CertificationController = CertificationController;
//# sourceMappingURL=CertificationController.js.map