import type { NextFunction, Request, Response } from "express";
export declare class PaiementController {
    static getAllPaiements(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOnePaiement(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPaiement(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updatePaiement(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deletePaiement(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static webhookConfirmation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PaiementController.d.ts.map