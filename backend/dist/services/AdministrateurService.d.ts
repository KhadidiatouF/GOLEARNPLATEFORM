export declare class AdministrateurService {
    private administrateurRepo;
    constructor();
    getStatistics(): Promise<{
        general: {
            users: number;
            formations: number;
            professors: number;
            sessions: number;
        };
        charts: {
            inscriptionsParMois: {
                mois: string;
                nombre: number;
            }[];
            formationsPopulaires: {
                titre: string;
                inscrits: number;
            }[];
            evolutionUtilisateurs: {
                mois: string;
                nombre: number;
            }[];
            repartitionCategorie: {
                nom: string;
                nombre: number;
            }[];
        };
    }>;
    getAllAdministrateurs(): Promise<{
        data: import("@prisma/client").Administrateur[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneAdministrateur(id: number): Promise<any>;
    createAdministrateur(data: any): Promise<{
        id: number;
        utilisateurId: number;
    }>;
    updateAdministrateur(id: number, data: any): Promise<{
        id: number;
        utilisateurId: number;
    }>;
    deleteAdministrateur(id: number): Promise<void>;
}
//# sourceMappingURL=AdministrateurService.d.ts.map