import { z } from "zod";

export const questionSchema = z.object({
    contenu: z.string().min(1, "Le contenu de la question est requis"),
    quizId: z.number().int().positive("L'ID du quiz doit être un nombre positif")
})

export const updateQuestionSchema = questionSchema.partial();
