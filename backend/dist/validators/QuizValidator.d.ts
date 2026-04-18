import { z } from "zod";
export declare const quizSchema: z.ZodObject<{
    score: z.ZodOptional<z.ZodNumber>;
    formationId: z.ZodNumber;
    sessionId: z.ZodNumber;
}, z.core.$strip>;
export declare const updateQuizSchema: z.ZodObject<{
    score: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    formationId: z.ZodOptional<z.ZodNumber>;
    sessionId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=QuizValidator.d.ts.map