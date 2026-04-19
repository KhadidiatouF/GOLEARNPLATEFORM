import type { NextFunction, Request, Response } from "express";
export declare class ProfessController {
    static getAllProfesseurs(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOneProfesseur(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createProfesseur(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static createDemandeProfesseur(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllDemandesProfesseur(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateProfesseur(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteProfesseur(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static validerProfesseur(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static rejeterProfesseur(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getDemandesEnAttente(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static validerDemandeProfesseur(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static rejeterDemandeProfesseur(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getHistoriqueRevenus(req: Request & {
        user?: {
            professeurId?: number;
        };
    }, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ProfesseurController.d.ts.map