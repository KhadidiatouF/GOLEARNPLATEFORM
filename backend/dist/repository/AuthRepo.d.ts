export interface Connexion {
    login: string;
    mdp: string;
}
export interface AuthReponse {
    user: {
        id: number;
        nom: string;
        prenom: string;
        login: string;
        email: string;
        role: string;
    };
    accessToken: string;
    refreshToken: string;
}
export declare class AuthRepository {
    static auth(connexion: Connexion): Promise<AuthReponse>;
    static refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
//# sourceMappingURL=AuthRepo.d.ts.map