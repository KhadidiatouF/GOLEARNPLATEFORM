"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSessionSchema = exports.sessionSchema = void 0;
const zod_1 = require("zod");
exports.sessionSchema = zod_1.z.object({
    titre: zod_1.z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    contenu: zod_1.z.string().min(1, "Le contenu est requis"),
    duree: zod_1.z.string().min(1, "La durée est requise"),
    typeContenu: zod_1.z.enum(["VIDEO", "PDF", "TEXTE"]),
    formationId: zod_1.z.number().int().positive("L'ID de la formation doit être un nombre positif")
});
exports.updateSessionSchema = exports.sessionSchema.partial();
//# sourceMappingURL=SessionValidator.js.map