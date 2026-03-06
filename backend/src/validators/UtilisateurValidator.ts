import { z } from "zod";

export const utilisateurSchema = z.object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    login: z.string().min(3, "Le login doit contenir au moins 3 caractères").max(20, "Le login doit comporter max 20 caractères"),
    mdp: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    role: z.enum(["ADMIN", "PROF", "APPRENANT"]),
    solde: z.number().min(0).optional()
})

export const updateUtilisateurSchema = utilisateurSchema;

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    mdp: z.string().min(1, "Le mot de passe est requis")
});
