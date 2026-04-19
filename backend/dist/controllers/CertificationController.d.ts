import type { NextFunction, Request, Response } from "express";
export declare class CertificationController {
    static getAdminCertifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getProfessorCertifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllCertifications(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getOneCertification(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createCertification(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static deleteCertification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=CertificationController.d.ts.map