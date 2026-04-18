import { z } from "zod";
export declare const questionSchema: z.ZodObject<{
    contenu: z.ZodString;
    quizId: z.ZodNumber;
}, z.core.$strip>;
export declare const updateQuestionSchema: z.ZodObject<{
    contenu: z.ZodOptional<z.ZodString>;
    quizId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=QuestionValidator.d.ts.map