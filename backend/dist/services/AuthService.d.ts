import { Connexion } from "../repository/AuthRepo";
export declare class AuthService {
    static login(connexion: Connexion): Promise<import("../repository/AuthRepo").AuthReponse>;
    static refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    static resetPassword(token: string, newPassword: string): Promise<{
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
//# sourceMappingURL=AuthService.d.ts.map