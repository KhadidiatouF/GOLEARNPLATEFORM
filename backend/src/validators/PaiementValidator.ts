import { z } from "zod";

export const paiementSchema = z.object({
    formationId: z.number().int().positive("L'ID de la formation est requis"),
    montant: z.number().positive("Le montant doit être positif").optional(),
    moyenPaiement: z.enum(["WAVE", "OM", "CARTE_BANCAIRE"]),
    apprenantId: z.number().int().positive("L'ID de l'apprenant doit être un nombre positif").optional(),
    reference: z.string().optional()
})

export const updatePaiementSchema = paiementSchema.partial();
