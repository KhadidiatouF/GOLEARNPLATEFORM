"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdministrateurSchema = exports.administrateurSchema = void 0;
const zod_1 = require("zod");
exports.administrateurSchema = zod_1.z.object({
    utilisateurId: zod_1.z.number().int().positive("L'ID utilisateur doit être un nombre positif")
});
exports.updateAdministrateurSchema = exports.administrateurSchema.partial();
//# sourceMappingURL=AdministrateurValidator.js.map