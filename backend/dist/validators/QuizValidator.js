"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuizSchema = exports.quizSchema = void 0;
const zod_1 = require("zod");
exports.quizSchema = zod_1.z.object({
    score: zod_1.z.number().optional(),
    formationId: zod_1.z.number().int().positive("L'ID de la formation doit être un nombre positif"),
    sessionId: zod_1.z.number().int().positive("L'ID de la session doit être un nombre positif")
});
exports.updateQuizSchema = exports.quizSchema.partial();
//# sourceMappingURL=QuizValidator.js.map