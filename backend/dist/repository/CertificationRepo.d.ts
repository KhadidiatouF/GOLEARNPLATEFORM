import { Certification } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class CertificationRepo implements IRepository<Certification> {
    private prisma;
    findAll(page?: number, limit?: number, apprenantId?: number): Promise<{
        data: Certification[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    findAllWithRelations(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByProfessorId(professeurId: number, page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByApprenantAndFormation(apprenantId: number, formationId: number): Promise<Certification | null>;
    create(data: Omit<Certification, "id">): Promise<Certification>;
    update(id: number, data: Certification): Promise<Certification>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=CertificationRepo.d.ts.map