import { Formation } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class FormationRepo implements IRepository<Formation> {
    private prisma;
    findAll(page?: number, limit?: number): Promise<{
        data: Formation[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    create(data: Omit<Formation, "id">): Promise<Formation>;
    update(id: number, data: Formation): Promise<Formation>;
    delete(id: number): Promise<void>;
    findByProfesseurId(professeurId: number): Promise<Formation[]>;
    updateStatut(id: number, statut: string): Promise<Formation>;
    findByStatut(statut: string): Promise<Formation[]>;
}
//# sourceMappingURL=FormationRepo.d.ts.map