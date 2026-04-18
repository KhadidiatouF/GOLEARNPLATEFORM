import { z } from "zod";
export declare const professeurSchema: z.ZodObject<{
    specialite: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateProfesseurSchema: z.ZodObject<{
    specialite: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const demandeProfesseurSchema: z.ZodObject<{
    nom: z.ZodString;
    prenom: z.ZodString;
    email: z.ZodString;
    domaineExpertise: z.ZodString;
    experience: z.ZodString;
    motivation: z.ZodString;
    specialite: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=ProfesseurValidator.d.ts.map