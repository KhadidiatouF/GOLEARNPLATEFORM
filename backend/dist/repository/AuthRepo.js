"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../auth/jwt");
const prisma = new client_1.PrismaClient();
class AuthRepository {
    static async auth(connexion) {
        const { login, mdp } = connexion;
        const userTrouve = await prisma.utilisateur.findUnique({
            where: { login },
            include: { professeur: true }
        });
        if (!userTrouve) {
            throw new Error("Login ou mot de passe incorrect");
        }
        const estPassword = await bcryptjs_1.default.compare(mdp, userTrouve.mdp);
        if (!estPassword) {
            throw new Error("Login ou mot de passe incorrect");
        }
        const payload = {
            login: userTrouve.login,
            mdp: userTrouve.mdp
        };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        const { mdp: _mdp, ...userwithoutpassword } = userTrouve;
        // Ajouter le professeurId si l'utilisateur est un professeur
        const userResponse = { ...userwithoutpassword };
        if (userTrouve.role === 'PROF' && userTrouve.professeur) {
            userResponse.professeurId = userTrouve.professeur.id;
        }
        return { accessToken, refreshToken, user: userResponse };
    }
    static async refreshToken(refreshToken) {
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        if (!payload) {
            throw new Error("Refresh token invalide");
        }
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        return { accessToken };
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=AuthRepo.js.map