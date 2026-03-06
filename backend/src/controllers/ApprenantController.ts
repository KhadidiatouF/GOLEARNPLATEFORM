import type { NextFunction, Request, Response } from "express";
import { ApprenantService } from "../services/ApprenantService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { apprenantSchema } from "../validators/ApprenantValidator";

const apprenantService = new ApprenantService();

export class ApprenantController{
 
    static async getAllApprenants(req: Request, res: Response, next: NextFunction){
        try {
            const apprenants = await apprenantService.getAllApprenants();
            if (apprenants) {
                FormaterResponse.success(res, apprenants, "Apprenants récupérés avec succès", HttpCode.OK )
            }else{
               FormaterResponse.failed(res, "Apprenants non trouvés",404)
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneApprenant(req: Request, res:Response, next: NextFunction){
        try {
            const id: number = Number (req.params.id)
            const apprenant = await apprenantService.getOneApprenant(id)

            if (apprenant) {
                FormaterResponse.success(res, apprenant, "Apprenant trouvé avec succès", HttpCode.OK)
            }else{
                FormaterResponse.failed(res,"Apprenant non trouvé", 404)
            }

        } catch (error) {
            next(error)
            
        }
    }

    static async createApprenant(req: Request, res: Response, next: NextFunction) {
      try {

        const data = apprenantSchema.parse(req.body);
        const apprenantC = await apprenantService.createApprenant(data);

        return FormaterResponse.success(res, apprenantC, "Apprenant créé avec succès", HttpCode.CREATED);

     } catch (error: any) {

        if (error.code === "P2002")
        {
            return FormaterResponse.failed(res,"L'apprenant existe déjà", HttpCode.CONFLICT);
        }

      if (error instanceof ZodError) {
            const firstError = error.issues[0]?.message || "Erreur de validation";
            return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
        }

        return FormaterResponse.failed(res,"Erreur serveur",HttpCode.INTERNAL_SERVER_ERROR);
       }
    }

    static async updateApprenant(req:Request, res: Response, next: NextFunction){
        try {
            const id: number = Number (req.params.id)
            const data = apprenantSchema.parse(req.body); 
            const apprenantU = await apprenantService.updateApprenant(id, data)
            if (apprenantU) {
              FormaterResponse.success(res, apprenantU, "Apprenant modifié avec succès", 200 )
            }
        } catch (error: any) {
            return (FormaterResponse.failed(res,"Apprenant non trouvé", 404))
        }
    }

    static async deleteApprenant(req:Request, res: Response){
        try {
            const id: number = Number (req.params.id);
            await apprenantService.deleteApprenant(id)
            res.status(HttpCode.NO_CONTENT).send()
        }catch (error: any) {
            return (FormaterResponse.failed(res,"Apprenant non trouvé", 404))
        }
    }


}
