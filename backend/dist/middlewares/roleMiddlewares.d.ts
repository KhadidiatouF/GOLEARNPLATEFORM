import { Role } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
export declare const roleMiddleware: (rolesAutorises: Role[]) => (req: Request & {
    user?: {
        id: number;
        email: string;
        role: Role;
    };
}, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=roleMiddlewares.d.ts.map