import type { NextFunction, Request, Response } from "express";
import {ProfesseurService} from "../services/ProfesseurService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { demandeProfesseurSchema, professeurSchema } from "../validators/ProfesseurValidator";

const professeurService = new ProfesseurService();

export class ProfessController{
  
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

        // Le professeur est créé avec le statut EN_ATTENTE par défaut
        return FormaterResponse.success(res, professeurC, "Demande de professeur soumise avec succès. En attente de validation par l'administrateur.", HttpCode.CREATED);

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

    static async createDemandeProfesseur(req: Request, res: Response) {
        try {
            const data = demandeProfesseurSchema.parse(req.body);
            const utilisateurId = (req as any).user?.id;
            const demande = await professeurService.createDemandeProfesseur(data, utilisateurId);

            return FormaterResponse.success(
                res,
                demande,
                "Demande de professeur soumise avec succes. Elle sera examinee par un administrateur.",
                HttpCode.CREATED
            );
        } catch (error: any) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }

            return FormaterResponse.failed(
                res,
                error.message || "Erreur lors de la soumission de la demande",
                HttpCode.BAD_REQUEST
            );
        }
    }

    static async getAllDemandesProfesseur(req: Request, res: Response) {
        try {
            const demandes = await professeurService.getAllDemandesProfesseur();
            return FormaterResponse.success(res, demandes, "Demandes recuperes avec succes", HttpCode.OK);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
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

    // Valider un professeur (action admin)
    static async validerProfesseur(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const professeur = await professeurService.validerProfesseur(id);
            if (professeur) {
                FormaterResponse.success(res, professeur, "Professeur validé avec succès", HttpCode.OK);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors de la validation", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Rejeter un professeur (action admin)
    static async rejeterProfesseur(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const professeur = await professeurService.rejeterProfesseur(id);
            if (professeur) {
                FormaterResponse.success(res, professeur, "Professeur rejeté avec succès", HttpCode.OK);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors du rejet", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Récupérer les demandes de professeur en attente
    static async getDemandesEnAttente(req: Request, res: Response, next: NextFunction) {
        try {
            const demandes = await professeurService.getDemandesProfesseurEnAttente();
            FormaterResponse.success(res, demandes, "Demandes de professeur en attente", HttpCode.OK);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async validerDemandeProfesseur(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const demande = await professeurService.validerDemandeProfesseur(id);
            return FormaterResponse.success(
                res,
                demande,
                "Demande approuvee, compte professeur cree et email envoye avec succes.",
                HttpCode.OK
            );
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors de l'approbation", HttpCode.BAD_REQUEST);
        }
    }

    static async rejeterDemandeProfesseur(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const demande = await professeurService.rejeterDemandeProfesseur(id);
            return FormaterResponse.success(
                res,
                demande,
                "Demande de professeur rejetee avec succes.",
                HttpCode.OK
            );
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors du rejet", HttpCode.BAD_REQUEST);
        }
    }

    static async getHistoriqueRevenus(req: Request & { user?: { professeurId?: number } }, res: Response) {
        try {
            const professeurId = req.user?.professeurId;

            if (!professeurId) {
                return FormaterResponse.failed(res, "Professeur non trouve", HttpCode.BAD_REQUEST);
            }

            const historique = await professeurService.getHistoriqueRevenus(professeurId);
            return FormaterResponse.success(
                res,
                historique,
                "Historique des revenus recupere avec succes",
                HttpCode.OK
            );
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }


}
