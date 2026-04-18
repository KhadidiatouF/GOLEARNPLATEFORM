"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaiementSchema = exports.paiementSchema = void 0;
const zod_1 = require("zod");
exports.paiementSchema = zod_1.z.object({
    formationId: zod_1.z.number().int().positive("L'ID de la formation est requis"),
    montant: zod_1.z.number().positive("Le montant doit être positif").optional(),
    moyenPaiement: zod_1.z.enum(["WAVE", "OM", "CARTE_BANCAIRE"]),
    apprenantId: zod_1.z.number().int().positive("L'ID de l'apprenant doit être un nombre positif").optional(),
    reference: zod_1.z.string().optional()
});
exports.updatePaiementSchema = exports.paiementSchema.partial();
//# sourceMappingURL=PaiementValidator.js.map