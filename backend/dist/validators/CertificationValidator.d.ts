import { z } from "zod";
export declare const certificationSchema: z.ZodObject<{
    apprenantId: z.ZodNumber;
    formationId: z.ZodNumber;
}, z.core.$strip>;
export declare const updateCertificationSchema: z.ZodObject<{
    apprenantId: z.ZodOptional<z.ZodNumber>;
    formationId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=CertificationValidator.d.ts.map