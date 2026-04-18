"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const QuizService_1 = require("../services/QuizService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const QuizValidator_1 = require("../validators/QuizValidator");
const quizService = new QuizService_1.QuizService();
class QuizController {
    static async getAllQuizzes(req, res, next) {
        try {
            const quizzes = await quizService.getAllQuizzes();
            if (quizzes) {
                formateReponse_1.FormaterResponse.success(res, quizzes, "Quizzes récupérés avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Quizzes non trouvés", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneQuiz(req, res, next) {
        try {
            const id = Number(req.params.id);
            const quiz = await quizService.getOneQuiz(id);
            if (quiz) {
                formateReponse_1.FormaterResponse.success(res, quiz, "Quiz trouvé avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Quiz non trouvé", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getFinalQuiz(req, res, next) {
        try {
            const formationId = Number(req.params.formationId);
            const quiz = await quizService.getFinalQuiz(formationId);
            if (quiz) {
                formateReponse_1.FormaterResponse.success(res, quiz, "Quiz final récupéré avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Quiz final non trouvé pour cette formation", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createQuiz(req, res, next) {
        try {
            const data = QuizValidator_1.quizSchema.parse(req.body);
            const quizC = await quizService.createQuiz(data);
            return formateReponse_1.FormaterResponse.success(res, quizC, "Quiz créé avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateQuiz(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = QuizValidator_1.quizSchema.parse(req.body);
            const quizU = await quizService.updateQuiz(id, data);
            if (quizU) {
                formateReponse_1.FormaterResponse.success(res, quizU, "Quiz modifié avec succès", 200);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Quiz non trouvé", 404);
        }
    }
    static async deleteQuiz(req, res) {
        try {
            const id = Number(req.params.id);
            await quizService.deleteQuiz(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Quiz non trouvé", 404);
        }
    }
    /**
     * Soumettre les réponses d'un quiz et obtenir le résultat
     * POST /quiz/:id/submit
     * Body: { answers: { questionId: reponseId } }
     */
    static async submitQuiz(req, res, next) {
        try {
            const quizId = Number(req.params.id);
            const { answers } = req.body;
            if (!answers || typeof answers !== 'object') {
                return formateReponse_1.FormaterResponse.failed(res, "Les réponses sont requises", codeError_1.HttpCode.BAD_REQUEST);
            }
            const result = await quizService.submitQuiz(quizId, answers);
            const message = result.isPassed
                ? "Félicitations ! Vous avez réussi le quiz (>= 60%)"
                : "Quiz non validé. Vous devez obtenir au moins 60% pour réussir.";
            formateReponse_1.FormaterResponse.success(res, result, message, codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la soumission", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Vérifier si l'apprenant peut passer le quiz final (certification)
     * GET /quiz/formation/:formationId/can-take-final
     */
    static async checkCanTakeFinalQuiz(req, res, next) {
        try {
            const formationId = Number(req.params.formationId);
            const result = await quizService.checkCanTakeFinalQuiz(formationId);
            if (result.canTakeFinal) {
                formateReponse_1.FormaterResponse.success(res, result, "Vous pouvez passer le quiz final de certification!", codeError_1.HttpCode.OK);
            }
            else {
                const message = result.failedQuizzes > 0
                    ? `Vous avez ${result.failedQuizzes} quiz(s) non validé(s). Vous devez les refaire pour atteindre 60%.`
                    : `Votre moyenne est de ${result.averageScore}%. Vous devez atteindre 60% pour passer le quiz final.`;
                formateReponse_1.FormaterResponse.success(res, result, message, codeError_1.HttpCode.OK);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la vérification", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Obtenir le résumé des quiz d'une formation
     * GET /quiz/formation/:formationId/summary
     */
    static async getQuizSummary(req, res, next) {
        try {
            const formationId = Number(req.params.formationId);
            const summary = await quizService.getQuizSummary(formationId);
            formateReponse_1.FormaterResponse.success(res, summary, "Résumé des quiz récupéré", codeError_1.HttpCode.OK);
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, error.message || "Erreur lors de la récupération du résumé", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.QuizController = QuizController;
//# sourceMappingURL=QuizController.js.map