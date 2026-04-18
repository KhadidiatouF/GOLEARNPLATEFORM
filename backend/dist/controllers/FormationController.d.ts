import type { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
export declare class FormationController {
    static getFormationsPubliques(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllFormations(req: Request & {
        user?: {
            id: number;
            email: string;
            role: Role;
            professeurId?: number;
        };
    }, res: Response, next: NextFunction): Promise<void>;
    static getOneFormation(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createFormation(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateFormation(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteFormation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * CRÉATION COMPLÈTE D'UNE FORMATION
     *
     * Crée une formation avec sessions, quiz, questions et réponses
     * en une seule requête avec transaction SQL
     */
    static createCompleteFormation(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static validerFormation(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static rejeterFormation(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getFormationsEnAttente(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=FormationController.d.ts.map