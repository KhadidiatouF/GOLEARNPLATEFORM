export declare class ApprenantService {
    private apprenantRepo;
    constructor();
    getAllApprenants(): Promise<{
        data: import("@prisma/client").Apprenant[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneApprenant(id: number): Promise<any>;
    createApprenant(data: any): Promise<{
        id: number;
        utilisateurId: number;
        niveau: string | null;
    }>;
    updateApprenant(id: number, data: any): Promise<{
        id: number;
        utilisateurId: number;
        niveau: string | null;
    }>;
    deleteApprenant(id: number): Promise<void>;
}
//# sourceMappingURL=ApprenantService.d.ts.map