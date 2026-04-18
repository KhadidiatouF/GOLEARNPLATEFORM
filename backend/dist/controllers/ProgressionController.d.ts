import type { NextFunction, Request, Response } from "express";
export declare class ProgressionController {
    static createProgression(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getProgression(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static completeChapter(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getProgressionByProfesseur(req: Request & {
        user?: any;
    }, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ProgressionController.d.ts.map