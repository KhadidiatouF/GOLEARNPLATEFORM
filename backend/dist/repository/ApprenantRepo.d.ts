import { Apprenant } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class ApprenantRepo implements IRepository<Apprenant> {
    private prisma;
    findAll(page?: number, limit?: number): Promise<{
        data: Apprenant[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    create(data: Omit<Apprenant, "id">): Promise<Apprenant>;
    update(id: number, data: Apprenant): Promise<Apprenant>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=ApprenantRepo.d.ts.map