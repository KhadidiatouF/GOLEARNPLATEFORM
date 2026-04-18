import nodemailer from "nodemailer";
import { config } from "./env";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export const mailerConfig = {
  from: config.EMAIL_FROM || config.EMAIL_USER || "no-reply@golearn.local",
  enabled: Boolean(config.EMAIL_USER && config.EMAIL_PASS),
  frontendUrl: config.FRONTEND_URL,
};
