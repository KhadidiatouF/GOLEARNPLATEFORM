import { z } from "zod";

export const formationSchema = z.object({
    titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    prix: z.number().positive("Le prix doit être positif"),
    categorie: z.string().min(1, "La catégorie est requise"),
    niveau: z.string().min(1, "Le niveau est requis"),
    image: z.string().optional(),
    typeCours: z.enum(["PAYANT", "GRATUIT"]),
    professeurId: z.number().int().positive("L'ID du professeur doit être un nombre positif")
})

export const updateFormationSchema = formationSchema.partial();
