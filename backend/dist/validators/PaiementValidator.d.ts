import { z } from "zod";
export declare const paiementSchema: z.ZodObject<{
    formationId: z.ZodNumber;
    montant: z.ZodOptional<z.ZodNumber>;
    moyenPaiement: z.ZodEnum<{
        WAVE: "WAVE";
        OM: "OM";
        CARTE_BANCAIRE: "CARTE_BANCAIRE";
    }>;
    apprenantId: z.ZodOptional<z.ZodNumber>;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updatePaiementSchema: z.ZodObject<{
    formationId: z.ZodOptional<z.ZodNumber>;
    montant: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    moyenPaiement: z.ZodOptional<z.ZodEnum<{
        WAVE: "WAVE";
        OM: "OM";
        CARTE_BANCAIRE: "CARTE_BANCAIRE";
    }>>;
    apprenantId: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    reference: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=PaiementValidator.d.ts.map