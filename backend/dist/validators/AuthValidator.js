"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = void 0;
const zod_1 = require("zod");
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(10, "Token invalide"),
    newPassword: zod_1.z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caracteres")
});
//# sourceMappingURL=AuthValidator.js.map