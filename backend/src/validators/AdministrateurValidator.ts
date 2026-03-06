import { z } from "zod";

export const administrateurSchema = z.object({
    utilisateurId: z.number().int().positive("L'ID utilisateur doit être un nombre positif")
})

export const updateAdministrateurSchema = administrateurSchema.partial();
