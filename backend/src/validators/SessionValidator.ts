import { z } from "zod";

export const sessionSchema = z.object({
    titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    contenu: z.string().min(1, "Le contenu est requis"),
    duree: z.string().min(1, "La durée est requise"),
    typeContenu: z.enum(["VIDEO", "PDF", "TEXTE"]),
    formationId: z.number().int().positive("L'ID de la formation doit être un nombre positif")
})

export const updateSessionSchema = sessionSchema.partial();
