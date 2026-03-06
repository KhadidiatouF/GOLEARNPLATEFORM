import type { NextFunction, Request, Response } from "express";
import {ProfesseurService} from "../services/ProfesseurService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { professeurSchema } from "../validators/ProfesseurValidator";

const professeurService = new ProfesseurService();

export class ProfesseurController{
 
    static async getAllProfesseurs(req: Request, res: Response, next: NextFunction){
        try {
            const professeurs = await professeurService.getAllProfesseurs();
            if (professeurs) {
                FormaterResponse.success(res, professeurs, "Professeurs récupérés avec succès", HttpCode.OK )
            }else{
               FormaterResponse.failed(res, "Professeurs non trouvés",404)
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneProfesseur(req: Request, res:Response, next: NextFunction){
        try {
            const id: number = Number (req.params.id)
            const professeur = await professeurService.getOneProfesseur(id)

            if (professeur) {
                FormaterResponse.success(res, professeur, "Professeur trouvé avec succès", HttpCode.OK)
            }else{
                FormaterResponse.failed(res,"Professeur non trouvé", 404)
            }

        } catch (error) {
            next(error)
            
        }
    }

    static async createProfesseur(req: Request, res: Response, next: NextFunction) {
      try {

        const data = professeurSchema.parse(req.body);
        const professeurC = await professeurService.createProfesseur(data);

        return FormaterResponse.success(res, professeurC, "Professeur créé avec succès", HttpCode.CREATED);

     } catch (error: any) {

        if (error.code === "P2002")
        {
            return FormaterResponse.failed(res,"Le professeur existe déjà", HttpCode.CONFLICT);
        }

      if (error instanceof ZodError) {
            const firstError = error.issues[0]?.message || "Erreur de validation";
            return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
        }

        return FormaterResponse.failed(res,"Erreur serveur",HttpCode.INTERNAL_SERVER_ERROR);
       }
    }

    static async updateProfesseur(req:Request, res: Response, next: NextFunction){
        try {
            const id: number = Number (req.params.id)
            const data = professeurSchema.parse(req.body); 
            const professeurU = await professeurService.updateProfesseur(id, data)
            if (professeurU) {
              FormaterResponse.success(res, professeurU, "Professeur modifié avec succès", 200 )
            }
        } catch (error: any) {
            return (FormaterResponse.failed(res,"Professeur non trouvé", 404))
        }
    }

    static async deleteProfesseur(req:Request, res: Response){
        try {
            const id: number = Number (req.params.id);
            await professeurService.deleteProfesseur(id)
            res.status(HttpCode.NO_CONTENT).send()
        }catch (error: any) {
            return (FormaterResponse.failed(res,"Professeur non trouvé", 404))
        }
    }


}
