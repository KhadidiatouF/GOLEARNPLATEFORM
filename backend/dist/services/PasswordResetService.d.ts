export declare class PasswordResetService {
    static issueToken(utilisateurId: number): Promise<{
        rawToken: string;
        resetLink: string;
        expiresAt: Date;
    }>;
    static resetPassword(rawToken: string, newPassword: string): Promise<{
        login: string;
        mdp: string;
        id: number;
        email: string;
        nom: string;
        prenom: string;
        dateCreation: Date;
        role: import("@prisma/client").$Enums.Role;
        solde: number | null;
    }>;
}
//# sourceMappingURL=PasswordResetService.d.ts.map