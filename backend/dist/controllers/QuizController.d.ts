import type { NextFunction, Request, Response } from "express";
export declare class QuizController {
    static getAllQuizzes(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOneQuiz(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFinalQuiz(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createQuiz(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateQuiz(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteQuiz(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Soumettre les réponses d'un quiz et obtenir le résultat
     * POST /quiz/:id/submit
     * Body: { answers: { questionId: reponseId } }
     */
    static submitQuiz(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Vérifier si l'apprenant peut passer le quiz final (certification)
     * GET /quiz/formation/:formationId/can-take-final
     */
    static checkCanTakeFinalQuiz(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Obtenir le résumé des quiz d'une formation
     * GET /quiz/formation/:formationId/summary
     */
    static getQuizSummary(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=QuizController.d.ts.map