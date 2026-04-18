"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApprenantSchema = exports.apprenantSchema = void 0;
const zod_1 = require("zod");
exports.apprenantSchema = zod_1.z.object({
    utilisateurId: zod_1.z.number().int().positive("L'ID utilisateur doit être un nombre positif"),
    niveau: zod_1.z.string().optional()
});
exports.updateApprenantSchema = exports.apprenantSchema.partial();
//# sourceMappingURL=ApprenantValidator.js.map