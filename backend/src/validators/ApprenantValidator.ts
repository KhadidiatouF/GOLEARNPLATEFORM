import { z } from "zod";

export const apprenantSchema = z.object({
    utilisateurId: z.number().int().positive("L'ID utilisateur doit être un nombre positif"),
    niveau: z.string().optional()
})

export const updateApprenantSchema = apprenantSchema.partial();
