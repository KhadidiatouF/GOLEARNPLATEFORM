import { z } from "zod";
export declare const sessionSchema: z.ZodObject<{
    titre: z.ZodString;
    contenu: z.ZodString;
    duree: z.ZodString;
    typeContenu: z.ZodEnum<{
        VIDEO: "VIDEO";
        PDF: "PDF";
        TEXTE: "TEXTE";
    }>;
    formationId: z.ZodNumber;
}, z.core.$strip>;
export declare const updateSessionSchema: z.ZodObject<{
    titre: z.ZodOptional<z.ZodString>;
    contenu: z.ZodOptional<z.ZodString>;
    duree: z.ZodOptional<z.ZodString>;
    typeContenu: z.ZodOptional<z.ZodEnum<{
        VIDEO: "VIDEO";
        PDF: "PDF";
        TEXTE: "TEXTE";
    }>>;
    formationId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=SessionValidator.d.ts.map