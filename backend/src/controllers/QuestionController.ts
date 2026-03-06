import type { NextFunction, Request, Response } from "express";
import { QuestionService } from "../services/QuestionService";
import { FormaterResponse } from "../middlewares/formateReponse";
import { HttpCode } from "../enums/codeError";
import { ZodError } from "zod";
import { questionSchema } from "../validators/QuestionValidator";

const questionService = new QuestionService();

export class QuestionController {
    static async getAllQuestions(req: Request, res: Response, next: NextFunction) {
        try {
            const questions = await questionService.getAllQuestions();
            if (questions) {
                FormaterResponse.success(res, questions, "Questions récupérées avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Questions non trouvées", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOneQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const question = await questionService.getOneQuestion(id);
            if (question) {
                FormaterResponse.success(res, question, "Question trouvée avec succès", HttpCode.OK);
            } else {
                FormaterResponse.failed(res, "Question non trouvée", 404);
            }
        } catch (error) {
            next(error);
        }
    }

    static async createQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            const data = questionSchema.parse(req.body);
            const questionC = await questionService.createQuestion(data);
            return FormaterResponse.success(res, questionC, "Question créée avec succès", HttpCode.CREATED);
        } catch (error: any) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return FormaterResponse.failed(res, firstError, HttpCode.BAD_REQUEST);
            }
            return FormaterResponse.failed(res, "Erreur serveur", HttpCode.INTERNAL_SERVER_ERROR);
        }
    }

    static async updateQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = Number(req.params.id);
            const data = questionSchema.parse(req.body);
            const questionU = await questionService.updateQuestion(id, data);
            if (questionU) {
                FormaterResponse.success(res, questionU, "Question modifiée avec succès", 200);
            }
        } catch (error: any) {
            return FormaterResponse.failed(res, "Question non trouvée", 404);
        }
    }

    static async deleteQuestion(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await questionService.deleteQuestion(id);
            res.status(HttpCode.NO_CONTENT).send();
        } catch (error: any) {
            return FormaterResponse.failed(res, "Question non trouvée", 404);
        }
    }
}
