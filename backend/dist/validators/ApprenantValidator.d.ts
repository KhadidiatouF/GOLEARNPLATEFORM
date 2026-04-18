import { z } from "zod";
export declare const apprenantSchema: z.ZodObject<{
    utilisateurId: z.ZodNumber;
    niveau: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateApprenantSchema: z.ZodObject<{
    utilisateurId: z.ZodOptional<z.ZodNumber>;
    niveau: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=ApprenantValidator.d.ts.map