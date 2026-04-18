"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCertificationSchema = exports.certificationSchema = void 0;
const zod_1 = require("zod");
exports.certificationSchema = zod_1.z.object({
    apprenantId: zod_1.z.number().int().positive("L'ID de l'apprenant doit être un nombre positif"),
    formationId: zod_1.z.number().int().positive("L'ID de la formation doit être un nombre positif")
});
exports.updateCertificationSchema = exports.certificationSchema.partial();
//# sourceMappingURL=CertificationValidator.js.map