import type { NextFunction, Request, Response } from "express";
export declare class AdministrateurController {
    static getAllAdministrateurs(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOneAdministrateur(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createAdministrateur(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateAdministrateur(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteAdministrateur(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=AdministrateurController.d.ts.map