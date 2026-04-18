"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const codeError_1 = require("../enums/codeError");
const messageError_1 = require("../middlewares/messageError");
const zod_1 = require("zod");
const AuthValidator_1 = require("../validators/AuthValidator");
class AuthController {
    static async login(req, res) {
        try {
            const connexion = req.body;
            const tokens = await AuthService_1.AuthService.login(connexion);
            if (!tokens) {
                return res.status(codeError_1.HttpCode.NOT_FOUND).json({ error: messageError_1.ErrorCode.TOKEN_NOT_FOUND });
            }
            res.status(codeError_1.HttpCode.OK).json({ tokens });
        }
        catch (error) {
            res.status(codeError_1.HttpCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    static async refreshToken(req, res) {
        try {
            const refreshToken = req.body;
            const token = await AuthService_1.AuthService.refreshToken(refreshToken);
            if (!token) {
                return res.status(codeError_1.HttpCode.NOT_FOUND).json({ error: messageError_1.ErrorCode.TOKEN_NOT_FOUND });
            }
            res.status(codeError_1.HttpCode.OK).json({ token });
        }
        catch (error) {
            res.status(codeError_1.HttpCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = AuthValidator_1.resetPasswordSchema.parse(req.body);
            await AuthService_1.AuthService.resetPassword(token, newPassword);
            return res.status(codeError_1.HttpCode.OK).json({
                success: true,
                message: "Mot de passe modifie avec succes."
            });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(codeError_1.HttpCode.BAD_REQUEST).json({
                    success: false,
                    message: error.issues[0]?.message || "Erreur de validation"
                });
            }
            return res.status(codeError_1.HttpCode.BAD_REQUEST).json({
                success: false,
                message: error.message || "Impossible de modifier le mot de passe."
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map