import type { NextFunction, Request, Response } from "express";
import { QuizService } from "../services/QuizService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { quizSchema } from "../validators/QuizValidator";

const quizService = new QuizService();

export class QuizController {
    static async getAllQuizzes(req: Request, res: Response, next: NextFunction) {
        try {
            const quizzes = await quizService.getAllQuizzes();
            if (quizzes) {
                FormaterResponse.success(res, quizzes, "Quizzes récupérés avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Quizzes non trouvés", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const quiz = await quizService.getOneQuiz(id);
            if (quiz) {
                FormaterResponse.success(res, quiz, "Quiz trouvé avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Quiz non trouvé", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async createQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const data = quizSchema.parse(req.body);
            const quizC = await quizService.createQuiz(data);
            return FormaterResponse.success(res, quizC, "Quiz créé avec succès", HttpCode.CREATED);
        } catch (error: any) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async updateQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const data = quizSchema.parse(req.body);
            const quizU = await quizService.updateQuiz(id, data);
            if (quizU) {
                FormaterResponse.success(res, quizU, "Quiz modifié avec succès", 200);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, "Quiz non trouvé", 404);
        }
    }

    static async deleteQuiz(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await quizService.deleteQuiz(id);
            res.status(HttpCode.NO_CONTENT).send();
        } catch (error: any) {
            return FormaterResponse.failed(res, "Quiz non trouvé", 404);
        }
    }

    /**
     * Soumettre les réponses d'un quiz et obtenir le résultat
     * POST /quiz/:id/submit
     * Body: { answers: { questionId: reponseId } }
     */
    static async submitQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const quizId: number = Number(req.params.id);
            const { answers } = req.body;
            
            if (!answers || typeof answers !== 'object') {
                return FormaterResponse.failed(res, "Les réponses sont requises", HttpCode.BAD_REQUEST);
            }

            const result = await quizService.submitQuiz(quizId, answers);
            
            const message = result.isPassed 
                ? "Félicitations ! Vous avez réussi le quiz (>= 60%)"
                : "Quiz non validé. Vous devez obtenir au moins 60% pour réussir.";

            FormaterResponse.success(res, result, message, HttpCode.OK);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors de la soumission", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Vérifier si l'apprenant peut passer le quiz final (certification)
     * GET /quiz/formation/:formationId/can-take-final
     */
    static async checkCanTakeFinalQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const formationId: number = Number(req.params.formationId);
            
            const result = await quizService.checkCanTakeFinalQuiz(formationId);
            
            if (result.canTakeFinal) {
                FormaterResponse.success(res, result, "Vous pouvez passer le quiz final de certification!", HttpCode.OK);
            } else {
                const message = result.failedQuizzes > 0
                    ? `Vous avez ${result.failedQuizzes} quiz(s) non validé(s). Vous devez les refaire pour atteindre 60%.`
                    : `Votre moyenne est de ${result.averageScore}%. Vous devez atteindre 60% pour passer le quiz final.`;
                
                FormaterResponse.success(res, result, message, HttpCode.OK);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors de la vérification", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtenir le résumé des quiz d'une formation
     * GET /quiz/formation/:formationId/summary
     */
    static async getQuizSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const formationId: number = Number(req.params.formationId);
            const summary = await quizService.getQuizSummary(formationId);
            
            FormaterResponse.success(res, summary, "Résumé des quiz récupéré", HttpCode.OK);
        } catch (error: any) {
            return FormaterResponse.failed(res, error.message || "Erreur lors de la récupération du résumé", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
