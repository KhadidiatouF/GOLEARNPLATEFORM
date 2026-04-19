"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.dotenvSchema = void 0;
const zod_1 = __importDefault(require("zod"));
require("dotenv/config");
exports.dotenvSchema = zod_1.default.object({
    NODE_ENV: zod_1.default.enum(["developpement", "production", "test"]).default("developpement"),
    PORT: zod_1.default.string().transform(Number).default(4003),
    DATABASE_URL: zod_1.default.string().min(5),
    JWT_SECRET: zod_1.default.string().min(1),
    JWT_REFRESH_SECRET: zod_1.default.string().min(1),
    EMAIL_USER: zod_1.default.string().email().optional(),
    EMAIL_PASS: zod_1.default.string().min(1).optional(),
    EMAIL_FROM: zod_1.default.string().optional(),
    FRONTEND_URL: zod_1.default.string().url().default("http://localhost:5173"),
    OPENAI_API_KEY: zod_1.default.string().min(1).optional(),
    OPENAI_MODEL: zod_1.default.string().min(1).optional()
});
exports.config = exports.dotenvSchema.parse(process.env);
//# sourceMappingURL=env.js.map