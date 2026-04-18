import type { NextFunction, Request, Response } from "express";
export declare class ApprenantController {
    static getAllApprenants(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOneApprenant(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createApprenant(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateApprenant(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteApprenant(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=ApprenantController.d.ts.map