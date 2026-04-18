import type { NextFunction, Request, Response } from "express";
export declare class SessionController {
    static getAllSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOneSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createSession(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateSession(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteSession(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=SessionController.d.ts.map