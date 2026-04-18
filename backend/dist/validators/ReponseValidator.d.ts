import { z } from "zod";
export declare const reponseSchema: z.ZodObject<{
    contenu: z.ZodString;
    estCorrecte: z.ZodBoolean;
    questionId: z.ZodNumber;
}, z.core.$strip>;
export declare const updateReponseSchema: z.ZodObject<{
    contenu: z.ZodOptional<z.ZodString>;
    estCorrecte: z.ZodOptional<z.ZodBoolean>;
    questionId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=ReponseValidator.d.ts.map