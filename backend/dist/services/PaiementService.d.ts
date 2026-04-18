export declare class PaiementService {
    private paiementRepo;
    private prisma;
    constructor();
    getAllPaiements(): Promise<{
        data: import("@prisma/client").Paiement[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOnePaiement(id: number): Promise<any>;
    private normalizeWebhookStatus;
    createPaiement(data: any, utilisateurId: number): Promise<{
        id: number;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        montant: number;
        moyenPaiement: import("@prisma/client").$Enums.MoyenPaiement;
        datePaiement: Date;
        transactionId: string | null;
        reference: string | null;
        callbackData: import("@prisma/client/runtime/library").JsonValue | null;
        apprenantFormationId: number;
    }>;
    confirmPaiement(data: any): Promise<boolean>;
    updatePaiement(id: number, data: any): Promise<{
        id: number;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        montant: number;
        moyenPaiement: import("@prisma/client").$Enums.MoyenPaiement;
        datePaiement: Date;
        transactionId: string | null;
        reference: string | null;
        callbackData: import("@prisma/client/runtime/library").JsonValue | null;
        apprenantFormationId: number;
    }>;
    deletePaiement(id: number): Promise<void>;
}
//# sourceMappingURL=PaiementService.d.ts.map