"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuestionSchema = exports.questionSchema = void 0;
const zod_1 = require("zod");
exports.questionSchema = zod_1.z.object({
    contenu: zod_1.z.string().min(1, "Le contenu de la question est requis"),
    quizId: zod_1.z.number().int().positive("L'ID du quiz doit être un nombre positif")
});
exports.updateQuestionSchema = exports.questionSchema.partial();
//# sourceMappingURL=QuestionValidator.js.map