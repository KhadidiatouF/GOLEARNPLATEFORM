import { z } from "zod";

export const resetPasswordSchema = z.object({
    token: z.string().min(10, "Token invalide"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caracteres")
});
