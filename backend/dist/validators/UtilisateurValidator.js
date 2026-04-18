"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.professeurSchema = exports.apprenantSchema = exports.loginSchema = exports.updateUtilisateurSchema = exports.utilisateurSchema = void 0;
const zod_1 = require("zod");
// Schéma de base pour la création d'un utilisateur
exports.utilisateurSchema = zod_1.z.object({
    nom: zod_1.z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: zod_1.z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: zod_1.z.string().email("Email invalide"),
    login: zod_1.z.string().min(3, "Le login doit contenir au moins 3 caractères").max(20, "Le login doit comporter max 20 caractères"),
    mdp: zod_1.z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    role: zod_1.z.enum(["ADMIN", "PROF", "APPRENANT"]),
    // Champs de la table Apprenant
    niveau: zod_1.z.string().optional(),
    // Champs de la table Professeur
    specialite: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    // Autres champs optionnels
    telephone: zod_1.z.string().optional(),
    date_naissance: zod_1.z.string().optional(),
    adresse: zod_1.z.string().optional(),
    photo: zod_1.z.string().optional(),
    demande_prof: zod_1.z.boolean().optional(),
    // Champ pour le solde (optionnel lors de la création)
    solde: zod_1.z.number().min(0).optional()
});
// Schéma pour la mise à jour - tous les champs sont optionnels
exports.updateUtilisateurSchema = exports.utilisateurSchema.partial();
// Schéma pour le login
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email invalide"),
    mdp: zod_1.z.string().min(1, "Le mot de passe est requis")
});
// Schéma spécifique pour un apprenant (niveau)
exports.apprenantSchema = zod_1.z.object({
    utilisateurId: zod_1.z.number().int().positive("L'ID utilisateur doit être un nombre positif"),
    niveau: zod_1.z.string().optional()
});
// Schéma spécifique pour un professeur (specialite, bio)
exports.professeurSchema = zod_1.z.object({
    specialite: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional()
});
//# sourceMappingURL=UtilisateurValidator.js.map