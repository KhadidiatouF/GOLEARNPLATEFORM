"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReponseSchema = exports.reponseSchema = void 0;
const zod_1 = require("zod");
exports.reponseSchema = zod_1.z.object({
    contenu: zod_1.z.string().min(1, "Le contenu de la réponse est requis"),
    estCorrecte: zod_1.z.boolean(),
    questionId: zod_1.z.number().int().positive("L'ID de la question doit être un nombre positif")
});
exports.updateReponseSchema = exports.reponseSchema.partial();
//# sourceMappingURL=ReponseValidator.js.map