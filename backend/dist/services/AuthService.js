"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const AuthRepo_1 = require("../repository/AuthRepo");
const PasswordResetService_1 = require("./PasswordResetService");
class AuthService {
    static async login(connexion) {
        return await AuthRepo_1.AuthRepository.auth(connexion);
    }
    static async refreshToken(refreshToken) {
        return await AuthRepo_1.AuthRepository.refreshToken(refreshToken);
    }
    static async resetPassword(token, newPassword) {
        return await PasswordResetService_1.PasswordResetService.resetPassword(token, newPassword);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map