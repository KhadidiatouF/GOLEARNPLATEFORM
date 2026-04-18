"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const mailer_1 = require("../config/mailer");
const prisma = new client_1.PrismaClient();
class PasswordResetService {
    static async issueToken(utilisateurId) {
        const rawToken = crypto_1.default.randomBytes(32).toString("hex");
        const tokenHash = crypto_1.default.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
        await prisma.passwordResetToken.create({
            data: {
                utilisateurId,
                tokenHash,
                expiresAt,
            },
        });
        return {
            rawToken,
            resetLink: `${mailer_1.mailerConfig.frontendUrl}/reset-password?token=${rawToken}`,
            expiresAt,
        };
    }
    static async resetPassword(rawToken, newPassword) {
        const tokenHash = crypto_1.default.createHash("sha256").update(rawToken).digest("hex");
        const storedToken = await prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            include: { utilisateur: true },
        });
        if (!storedToken || storedToken.usedAt || storedToken.expiresAt < new Date()) {
            throw new Error("Le lien de réinitialisation est invalide ou expiré.");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.$transaction([
            prisma.utilisateur.update({
                where: { id: storedToken.utilisateurId },
                data: { mdp: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: storedToken.id },
                data: { usedAt: new Date() },
            }),
        ]);
        return storedToken.utilisateur;
    }
}
exports.PasswordResetService = PasswordResetService;
//# sourceMappingURL=PasswordResetService.js.map