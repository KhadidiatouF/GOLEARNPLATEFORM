"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilisateurController = void 0;
const UtilisateurService_1 = require("../services/UtilisateurService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const UtilisateurValidator_1 = require("../validators/UtilisateurValidator");
const client_1 = require("@prisma/client");
const utilisateurService = new UtilisateurService_1.UtilisateurService();
class UtilisateurController {
    static async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const role = req.query.role;
            const search = req.query.search;
            const result = await utilisateurService.getAllUser(page, limit, role, search);
            // Vérifier si le résultat existe (pas si le tableau est vide)
            if (result) {
                formateReponse_1.FormaterResponse.success(res, {
                    users: result.data,
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / result.limit)
                    }
                }, "Users récupérés avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Utilisateurs non trouvés", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            const user = await utilisateurService.getOneUser(id);
            if (user) {
                formateReponse_1.FormaterResponse.success(res, user, "Utilisateur trouvé avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Utilisateur non trouvé", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer le profil de l'utilisateur connecté (avec son solde)
    static async getMonProfil(req, res, next) {
        try {
            // L'ID de l'utilisateur est dans req.user.id (injecté par le middleware authenticate)
            const userIdAny = req.user?.id;
            console.log('getMonProfil - user from token:', req.user);
            console.log('getMonProfil - raw userId:', userIdAny, 'type:', typeof userIdAny);
            // Convertir explicitement en nombre
            const userId = Number(userIdAny);
            console.log('getMonProfil - converted userId:', userId, 'isNaN:', isNaN(userId));
            if (!userId || isNaN(userId)) {
                return formateReponse_1.FormaterResponse.failed(res, "Utilisateur non identifié", codeError_1.HttpCode.UNAUTHORIZED);
            }
            // Utiliser le repository directement pour éviter le problème
            const prisma = new client_1.PrismaClient();
            const user = await prisma.utilisateur.findUnique({
                where: { id: userId }
            });
            console.log('getMonProfil - user from DB:', user);
            if (user) {
                formateReponse_1.FormaterResponse.success(res, user, "Profil récupéré avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Utilisateur non trouvé", 404);
            }
        }
        catch (error) {
            console.error('getMonProfil - error:', error);
            next(error);
        }
    }
    static async createUser(req, res, next) {
        try {
            const data = UtilisateurValidator_1.utilisateurSchema.parse(req.body);
            const userC = await utilisateurService.createUser(data);
            return formateReponse_1.FormaterResponse.success(res, userC, "Utilisateur créé avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error.code === "P2002") {
                console.error("Erreur Zod:", error);
                return formateReponse_1.FormaterResponse.failed(res, "Le login doit etre unique", codeError_1.HttpCode.CONFLICT);
            }
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur server", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            // Utiliser le schéma de mise à jour (champs optionnels)
            const data = UtilisateurValidator_1.updateUtilisateurSchema.parse(req.body);
            const userU = await utilisateurService.updateUser(id, data);
            if (userU) {
                formateReponse_1.FormaterResponse.success(res, userU, "User Modifié  avec succès", 200);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Utilisateur non trouvé", 404);
            }
        }
        catch (error) {
            // Si l'erreur est une erreur Prisma (record not found)
            if (error.code === 'P2025') {
                return formateReponse_1.FormaterResponse.failed(res, "Utilisateur non trouvé", 404);
            }
            // Si l'erreur est une erreur de validation Zod
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, 400);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", 500);
        }
    }
    static async deleteUser(req, res) {
        try {
            const id = Number(req.params.id);
            await utilisateurService.deleteUser(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return (formateReponse_1.FormaterResponse.failed(res, "utilisateur non trouvé", 404));
        }
    }
}
exports.UtilisateurController = UtilisateurController;
//# sourceMappingURL=UtilisateurController.js.map