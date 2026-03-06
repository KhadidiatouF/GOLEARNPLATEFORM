import { z } from "zod";

export const reponseSchema = z.object({
    contenu: z.string().min(1, "Le contenu de la réponse est requis"),
    estCorrecte: z.boolean(),
    questionId: z.number().int().positive("L'ID de la question doit être un nombre positif")
})

export const updateReponseSchema = reponseSchema.partial();
