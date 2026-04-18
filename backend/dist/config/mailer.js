"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailerConfig = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("./env");
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: env_1.config.EMAIL_USER,
        pass: env_1.config.EMAIL_PASS,
    },
});
exports.mailerConfig = {
    from: env_1.config.EMAIL_FROM || env_1.config.EMAIL_USER || "no-reply@golearn.local",
    enabled: Boolean(env_1.config.EMAIL_USER && env_1.config.EMAIL_PASS),
    frontendUrl: env_1.config.FRONTEND_URL,
};
//# sourceMappingURL=mailer.js.map