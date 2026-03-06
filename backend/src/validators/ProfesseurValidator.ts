import { z } from "zod";

export const professeurSchema = z.object({
    specialite: z.string().optional(),
    bio: z.string().optional()
})

export const updateProfesseurSchema = professeurSchema;
