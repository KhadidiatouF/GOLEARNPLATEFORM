import { z } from "zod";

// Schéma de base pour la création d'un utilisateur
export const utilisateurSchema = z.object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    login: z.string().min(3, "Le login doit contenir au moins 3 caractères").max(20, "Le login doit comporter max 20 caractères"),
    mdp: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    role: z.enum(["ADMIN", "PROF", "APPRENANT"]),
    // Champs de la table Apprenant
    niveau: z.string().optional(),
    // Champs de la table Professeur
    specialite: z.string().optional(),
    bio: z.string().optional(),
    // Autres champs optionnels
    telephone: z.string().optional(),
    date_naissance: z.string().optional(),
    adresse: z.string().optional(),
    photo: z.string().optional(),
    demande_prof: z.boolean().optional(),
    // Champ pour le solde (optionnel lors de la création)
    solde: z.number().min(0).optional()
});

// Schéma pour la mise à jour - tous les champs sont optionnels
export const updateUtilisateurSchema = utilisateurSchema.partial();

// Schéma pour le login
export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    mdp: z.string().min(1, "Le mot de passe est requis")
});

// Schéma spécifique pour un apprenant (niveau)
export const apprenantSchema = z.object({
    utilisateurId: z.number().int().positive("L'ID utilisateur doit être un nombre positif"),
    niveau: z.string().optional()
});

// Schéma spécifique pour un professeur (specialite, bio)
export const professeurSchema = z.object({
    specialite: z.string().optional(),
    bio: z.string().optional()
});
