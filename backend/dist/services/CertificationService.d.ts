export declare class CertificationService {
    private certificationRepo;
    constructor();
    getAllCertifications(apprenantId?: number): Promise<{
        data: import("@prisma/client").Certification[];
        total: number;
        page: number;
        limit: number;
    }>;
    getCertificationsByApprenantId(apprenantId: number): Promise<{
        data: import("@prisma/client").Certification[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneCertification(id: number): Promise<any>;
    createCertification(data: any): Promise<{
        id: number;
        apprenantId: number;
        formationId: number;
        dateObtention: Date;
    }>;
    createCertificationIfMissing(apprenantId: number, formationId: number): Promise<{
        id: number;
        apprenantId: number;
        formationId: number;
        dateObtention: Date;
    }>;
    updateCertification(id: number, data: any): Promise<{
        id: number;
        apprenantId: number;
        formationId: number;
        dateObtention: Date;
    }>;
    deleteCertification(id: number): Promise<void>;
}
//# sourceMappingURL=CertificationService.d.ts.map