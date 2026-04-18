import { z } from "zod";

export const professeurSchema = z.object({
    specialite: z.string().optional(),
    bio: z.string().optional()
})

export const updateProfesseurSchema = professeurSchema;

export const demandeProfesseurSchema = z.object({
    nom: z.string().min(2, "Le nom est requis"),
    prenom: z.string().min(2, "Le prénom est requis"),
    email: z.string().email("Email invalide"),
    domaineExpertise: z.string().min(2, "Le domaine d'expertise est requis"),
    experience: z.string().min(1, "L'expérience est requise"),
    motivation: z.string().min(10, "La motivation doit contenir au moins 10 caractères"),
    specialite: z.string().optional(),
    bio: z.string().optional()
});
