import type { NextFunction, Request, Response } from "express";
export declare class UtilisateurController {
    static getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOneUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMonProfil(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static createUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=UtilisateurController.d.ts.map