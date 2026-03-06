import { z } from "zod";

export const certificationSchema = z.object({
    apprenantId: z.number().int().positive("L'ID de l'apprenant doit être un nombre positif"),
    formationId: z.number().int().positive("L'ID de la formation doit être un nombre positif")
})

export const updateCertificationSchema = certificationSchema.partial();
