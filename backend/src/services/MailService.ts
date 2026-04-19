import { mailerConfig, transporter } from "../config/mailer";

interface SendProfessorCredentialsEmailParams {
  recipientEmail: string;
  recipientName: string;
  login: string;
  temporaryPassword: string;
  resetLink: string;
}

export class MailService {
  static async sendProfessorCredentialsEmail({
    recipientEmail,
    recipientName,
    login,
    temporaryPassword,
    resetLink,
  }: SendProfessorCredentialsEmailParams) {
    if (!mailerConfig.enabled) {
      console.warn(
        `[MAIL DISABLED] Email professeur non envoye a ${recipientEmail}. Configure EMAIL_USER et EMAIL_PASS pour activer l'envoi.`
      );
      return;
    }

    const subject = "GOLEARN - Votre compte professeur est pret";
    const text = [
      `Bonjour ${recipientName},`,
      "",
      "Votre demande de formateur a ete approuvee.",
      "Votre compte professeur GOLEARN est maintenant actif.",
      "",
      `Login : ${login}`,
      `Mot de passe temporaire : ${temporaryPassword}`,
      "",
      "Pour securiser votre compte, modifiez votre mot de passe des maintenant via ce lien :",
      resetLink,
      "",
      "Si vous n'etes pas a l'origine de cette demande, contactez immediatement le support.",
      "",
      "L'equipe GOLEARN",
    ].join("\n");

    const html = `
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
        </head>
        <body style="margin:0;padding:0;background:#f4f1ff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ff;padding:24px 12px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 40px rgba(76,29,149,0.12);">
                  <tr>
                    <td style="padding:32px;background-color:#7c3aed;text-align:left;">
                      <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#ffffff;font-weight:700;margin-bottom:10px;">GOLEARN</div>
                      <h1 style="margin:0;font-size:28px;line-height:1.2;color:#ffffff;">Votre compte professeur est actif</h1>
                      <p style="margin:12px 0 0;color:rgba(255,255,255,0.9);font-size:15px;line-height:1.6;">Votre demande a été validée par l'administration. Vous pouvez maintenant accéder à votre espace formateur.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px;">
                      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Bonjour <strong>${recipientName}</strong>,</p>
                      <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#4b5563;">
                        Votre profil professeur a ete cree avec succes. Pour votre premiere connexion, utilisez les identifiants temporaires ci-dessous puis changez votre mot de passe des que possible.
                      </p>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;background:#faf7ff;border:1px solid #e9d5ff;border-radius:20px;margin-bottom:24px;">
                        <tr>
                          <td style="padding:24px;">
                            <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;font-weight:700;">Login</p>
                            <p style="margin:0 0 18px;font-size:18px;font-weight:700;color:#111827;">${login}</p>
                            <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;font-weight:700;">Mot de passe temporaire</p>
                            <p style="margin:0;font-size:18px;font-weight:700;color:#111827;">${temporaryPassword}</p>
                          </td>
                        </tr>
                      </table>

                      <div style="margin-bottom:24px;">
                        <a href="${resetLink}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#6d28d9;color:#ffffff;text-decoration:none;font-weight:700;">Modifier mon mot de passe</a>
                      </div>

                      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:18px 20px;margin-bottom:24px;">
                        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#9a3412;">Recommandation securite</p>
                        <p style="margin:0;font-size:14px;line-height:1.7;color:#7c2d12;">
                          Ce lien de securisation expire dans 24 heures. Si vous n'etes pas a l'origine de cette demande, repondez directement a cet email ou contactez l'equipe GOLEARN.
                        </p>
                      </div>

                      <p style="margin:0;font-size:14px;line-height:1.7;color:#6b7280;">
                        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
                        <br />
                        <a href="${resetLink}" style="color:#6d28d9;word-break:break-all;">${resetLink}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 32px;background:#faf5ff;border-top:1px solid #ede9fe;">
                      <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">
                        GOLEARN • Plateforme de formation professionnelle
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: mailerConfig.from,
      to: recipientEmail,
      subject,
      text,
      html,
    });
  }
}
