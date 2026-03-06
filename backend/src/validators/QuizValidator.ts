import { z } from "zod";

export const quizSchema = z.object({
    score: z.number().optional(),
    formationId: z.number().int().positive("L'ID de la formation doit être un nombre positif"),
    sessionId: z.number().int().positive("L'ID de la session doit être un nombre positif")
})

export const updateQuizSchema = quizSchema.partial();
