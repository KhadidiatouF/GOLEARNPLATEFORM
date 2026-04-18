"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../auth/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Middleware pour authentifier les requêtes
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token d'authentification requis" });
        }
        const token = authHeader.substring(7); // Enlever "Bearer "
        // Vérifier le token
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        // Rechercher l'utilisateur dans la base de données
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { login: decoded.login },
            include: { professeur: true }
        });
        if (!utilisateur) {
            return res.status(401).json({ error: "Utilisateur non trouvé" });
        }
        // Ajouter les informations utilisateur à la requête
        req.user = {
            id: utilisateur.id,
            email: utilisateur.email,
            role: utilisateur.role,
            login: utilisateur.login,
            professeurId: utilisateur.professeur?.id
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map