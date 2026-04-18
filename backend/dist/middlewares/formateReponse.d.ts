import { Response } from "express";
export declare class FormaterResponse {
    static success(res: Response, data: any, message: string, status: number): Response<any, Record<string, any>>;
    static failed(res: Response, message: string, status: number): Response<any, Record<string, any>>;
}
//# sourceMappingURL=formateReponse.d.ts.map