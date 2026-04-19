import z from "zod";
import "dotenv/config";

export const dotenvSchema = z.object({
    NODE_ENV: z.enum(["developpement", "production", "test"]).default("developpement"),
    PORT: z.string().transform(Number).default(4003),
    DATABASE_URL: z.string().min(5),
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    EMAIL_USER: z.string().email().optional(),
    EMAIL_PASS: z.string().min(1).optional(),
    EMAIL_FROM: z.string().optional(),
    FRONTEND_URL: z.string().url().default("http://localhost:5173"),
    OPENAI_API_KEY: z.string().min(1).optional(),
    OPENAI_MODEL: z.string().min(1).optional()
})

export const config = dotenvSchema.parse(process.env)
