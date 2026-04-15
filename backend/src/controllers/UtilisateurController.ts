import type { NextFunction, Request, Response } from "express";
import { UtilisateurService } from "../services/UtilisateurService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { utilisateurSchema, updateUtilisateurSchema } from "../validators/UtilisateurValidator";
import { PrismaClient } from "@prisma/client";

const utilisateurService = new UtilisateurService();

export class UtilisateurController{
 
    static async getAllUsers(req: Request, res: Response, next: NextFunction){
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const role = req.query.role as string | undefined;
            const search = req.query.search as string | undefined;
            
            const result = await utilisateurService.getAllUser(page, limit, role, search);
            
            // Vérifier si le résultat existe (pas si le tableau est vide)
            if (result) {
                FormaterResponse.success(res, {
                    users: result.data,
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: Math.ceil(result.total / result.limit)
                    }
                }, "Users récupérés avec succès", HttpCode.OK )
            }else{
               FormaterResponse.failed(res, "Utilisateurs non trouvés",404)
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneUser(req: Request, res:Response, next: NextFunction){
        try {
            const id: number = Number (req.params.id)
            const user = await utilisateurService.getOneUser(id)

            if (user) {
                FormaterResponse.success(res, user, "Utilisateur trouvé avec succès", HttpCode.OK)
            }else{
                FormaterResponse.failed(res,"Utilisateur non trouvé", 404)
            }

        } catch (error) {
            next(error)
            
        }
    }

    // Récupérer le profil de l'utilisateur connecté (avec son solde)
    static async getMonProfil(req: Request, res: Response, next: NextFunction) {
        try {
            // L'ID de l'utilisateur est dans req.user.id (injecté par le middleware authenticate)
            const userIdAny = (req as any).user?.id;
            
            console.log('getMonProfil - user from token:', (req as any).user);
            console.log('getMonProfil - raw userId:', userIdAny, 'type:', typeof userIdAny);
            
            // Convertir explicitement en nombre
            const userId = Number(userIdAny);
            console.log('getMonProfil - converted userId:', userId, 'isNaN:', isNaN(userId));
            
            if (!userId || isNaN(userId)) {
                return FormaterResponse.failed(res, "Utilisateur non identifié", HttpCode.UNAUTHORIZED);
            }
            
            // Utiliser le repository directement pour éviter le problème
            const prisma = new PrismaClient();
            const user = await prisma.utilisateur.findUnique({
                where: { id: userId }
            });
            
            console.log('getMonProfil - user from DB:', user);
            
            if (user) {
                FormaterResponse.success(res, user, "Profil récupéré avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Utilisateur non trouvé", 404);
            }
        } catch (error: any) {
            console.error('getMonProfil - error:', error);
            next(error);
        }
    }

    static async createUser(req: Request, res: Response, next: NextFunction) {
      try {

        const data = utilisateurSchema.parse(req.body);
        const userC = await utilisateurService.createUser(data);

        return FormaterResponse.success(res, userC, "Utilisateur créé avec succès", HttpCode.CREATED);

     } catch (error: any) {


        if (error.code === "P2002")
        {
            console.error("Erreur Zod:", error);

            return FormaterResponse.failed(res,"Le login doit etre unique", HttpCode.CONFLICT,
            );
        }

      if (error instanceof ZodError) {
            const firstError = error.issues[0]?.message || "Erreur de validation";
            return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
        }

        return FormaterResponse.failed(res,"Erreur server",HttpCode.INTERNAL_SERVER_ERROR
        );
       }
    }

    static async updateUser(req:Request, res: Response, next: NextFunction){
        try {
            const id: number = Number (req.params.id)
            // Utiliser le schéma de mise à jour (champs optionnels)
            const data = updateUtilisateurSchema.parse(req.body); 
            const userU = await utilisateurService.updateUser(id, data)
            if (userU) {
              FormaterResponse.success(res, userU, "User Modifié  avec succès", 200 )
            } else {
              FormaterResponse.failed(res, "Utilisateur non trouvé", 404)
            }
        } catch (error: any) {
            // Si l'erreur est une erreur Prisma (record not found)
            if (error.code === 'P2025') {
                return FormaterResponse.failed(res, "Utilisateur non trouvé", 404)
            }
            // Si l'erreur est une erreur de validation Zod
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, 400);
            }
            return FormaterResponse.failed(res, "Erreur serveur", 500)
        }
    }

    static async deleteUser(req:Request, res: Response){
        try {
            const id: number = Number (req.params.id);
            await utilisateurService.deleteUser(id)
            res.status(HttpCode.NO_CONTENT).send()
        }catch (error: any) {
            return (FormaterResponse.failed(res,"utilisateur non trouvé", 404))
        }
    }


}