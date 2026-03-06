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
}
