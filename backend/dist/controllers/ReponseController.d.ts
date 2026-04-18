import type { NextFunction, Request, Response } from "express";
export declare class ReponseController {
    static getAllReponses(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOneReponse(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createReponse(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateReponse(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteReponse(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=ReponseController.d.ts.map