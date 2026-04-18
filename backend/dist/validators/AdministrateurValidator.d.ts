import { z } from "zod";
export declare const administrateurSchema: z.ZodObject<{
    utilisateurId: z.ZodNumber;
}, z.core.$strip>;
export declare const updateAdministrateurSchema: z.ZodObject<{
    utilisateurId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=AdministrateurValidator.d.ts.map