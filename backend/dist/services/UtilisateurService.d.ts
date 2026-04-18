export declare class UtilisateurService {
    private utilisateurRepo;
    constructor();
    getAllUser(page?: number, limit?: number, role?: string, search?: string): Promise<{
        data: import("@prisma/client").Utilisateur[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneUser(id: number): Promise<any>;
    createUser(data: any): Promise<{
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
    updateUser(id: number, data: any): Promise<{
        login: string;
        mdp: string;
        id: number;
        email: string;
        nom: string;
        prenom: string;
        dateCreation: Date;
        role: import("@prisma/client").$Enums.Role;
        solde: number | null;
    } | null>;
    deleteUser(id: number): Promise<void>;
}
//# sourceMappingURL=UtilisateurService.d.ts.map