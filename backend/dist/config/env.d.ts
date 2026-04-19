import z from "zod";
import "dotenv/config";
export declare const dotenvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        developpement: "developpement";
        production: "production";
        test: "test";
    }>>;
    PORT: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    DATABASE_URL: z.ZodString;
    JWT_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    EMAIL_USER: z.ZodOptional<z.ZodString>;
    EMAIL_PASS: z.ZodOptional<z.ZodString>;
    EMAIL_FROM: z.ZodOptional<z.ZodString>;
    FRONTEND_URL: z.ZodDefault<z.ZodString>;
    OPENAI_API_KEY: z.ZodOptional<z.ZodString>;
    OPENAI_MODEL: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const config: {
    NODE_ENV: "developpement" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    FRONTEND_URL: string;
    EMAIL_USER?: string | undefined;
    EMAIL_PASS?: string | undefined;
    EMAIL_FROM?: string | undefined;
    OPENAI_API_KEY?: string | undefined;
    OPENAI_MODEL?: string | undefined;
};
//# sourceMappingURL=env.d.ts.map