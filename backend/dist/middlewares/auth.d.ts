import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: Role;
        login: string;
        professeurId?: number;
    };
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.d.ts.map