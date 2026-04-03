import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../auth/jwt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// Interface étendue pour req.user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: Role;
    login: string;
    professeurId?: number;
  };
}

// Middleware pour authentifier les requêtes
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token d'authentification requis" });
    }
    
    const token = authHeader.substring(7); // Enlever "Bearer "
    
    // Vérifier le token
    const decoded = verifyAccessToken(token);
    
    // Rechercher l'utilisateur dans la base de données
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { login: decoded.login },
      include: { professeur: true }
    });
    
    if (!utilisateur) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }
    
    // Ajouter les informations utilisateur à la requête
    (req as any).user = {
      id: utilisateur.id,
      email: utilisateur.email,
      role: utilisateur.role,
      login: utilisateur.login,
      professeurId: utilisateur.professeur?.id
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};
