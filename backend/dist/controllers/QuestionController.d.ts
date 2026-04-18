import type { NextFunction, Request, Response } from "express";
export declare class QuestionController {
    static getAllQuestions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOneQuestion(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createQuestion(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateQuestion(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteQuestion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=QuestionController.d.ts.map