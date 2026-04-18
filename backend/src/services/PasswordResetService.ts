import crypto from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { mailerConfig } from "../config/mailer";

const prisma = new PrismaClient();

export class PasswordResetService {
  static async issueToken(utilisateurId: number) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await prisma.passwordResetToken.create({
      data: {
        utilisateurId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      rawToken,
      resetLink: `${mailerConfig.frontendUrl}/reset-password?token=${rawToken}`,
      expiresAt,
    };
  }

  static async resetPassword(rawToken: string, newPassword: string) {
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const storedToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { utilisateur: true },
    });

    if (!storedToken || storedToken.usedAt || storedToken.expiresAt < new Date()) {
      throw new Error("Le lien de réinitialisation est invalide ou expiré.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.utilisateur.update({
        where: { id: storedToken.utilisateurId },
        data: { mdp: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: storedToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return storedToken.utilisateur;
  }
}
