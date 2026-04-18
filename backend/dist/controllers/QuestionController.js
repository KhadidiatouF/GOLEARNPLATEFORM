"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const QuestionService_1 = require("../services/QuestionService");
const formateReponse_1 = require("../middlewares/formateReponse");
const codeError_1 = require("../enums/codeError");
const zod_1 = require("zod");
const QuestionValidator_1 = require("../validators/QuestionValidator");
const questionService = new QuestionService_1.QuestionService();
class QuestionController {
    static async getAllQuestions(req, res, next) {
        try {
            const questions = await questionService.getAllQuestions();
            if (questions) {
                formateReponse_1.FormaterResponse.success(res, questions, "Questions récupérées avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Questions non trouvées", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async getOneQuestion(req, res, next) {
        try {
            const id = Number(req.params.id);
            const question = await questionService.getOneQuestion(id);
            if (question) {
                formateReponse_1.FormaterResponse.success(res, question, "Question trouvée avec succès", codeError_1.HttpCode.OK);
            }
            else {
                formateReponse_1.FormaterResponse.failed(res, "Question non trouvée", 404);
            }
        }
        catch (error) {
            next(error);
        }
    }
    static async createQuestion(req, res, next) {
        try {
            const data = QuestionValidator_1.questionSchema.parse(req.body);
            const questionC = await questionService.createQuestion(data);
            return formateReponse_1.FormaterResponse.success(res, questionC, "Question créée avec succès", codeError_1.HttpCode.CREATED);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const firstError = error.issues[0]?.message || "Erreur de validation";
                return formateReponse_1.FormaterResponse.failed(res, firstError, codeError_1.HttpCode.BAD_REQUEST);
            }
            return formateReponse_1.FormaterResponse.failed(res, "Erreur serveur", codeError_1.HttpCode.INTERNAL_SERVER_ERROR);
        }
    }
    static async updateQuestion(req, res, next) {
        try {
            const id = Number(req.params.id);
            const data = QuestionValidator_1.questionSchema.parse(req.body);
            const questionU = await questionService.updateQuestion(id, data);
            if (questionU) {
                formateReponse_1.FormaterResponse.success(res, questionU, "Question modifiée avec succès", 200);
            }
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Question non trouvée", 404);
        }
    }
    static async deleteQuestion(req, res) {
        try {
            const id = Number(req.params.id);
            await questionService.deleteQuestion(id);
            res.status(codeError_1.HttpCode.NO_CONTENT).send();
        }
        catch (error) {
            return formateReponse_1.FormaterResponse.failed(res, "Question non trouvée", 404);
        }
    }
}
exports.QuestionController = QuestionController;
//# sourceMappingURL=QuestionController.js.map