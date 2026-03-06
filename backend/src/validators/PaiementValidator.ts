import { z } from "zod";

export const paiementSchema = z.object({
    montant: z.number().positive("Le montant doit être positif"),
    moyenPaiement: z.enum(["WAVE", "OM", "CARTE_BANCAIRE"]),
    apprenantId: z.number().int().positive("L'ID de l'apprenant doit être un nombre positif")
})

export const updatePaiementSchema = paiementSchema.partial();
