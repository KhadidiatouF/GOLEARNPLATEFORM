import { Paiement, Prisma } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class PaiementRepo implements IRepository<Paiement> {
    private prisma;
    findAll(page?: number, limit?: number, professeurId?: number): Promise<{
        data: Paiement[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    create(data: Prisma.PaiementCreateInput): Promise<Paiement>;
    update(id: number, data: Prisma.PaiementUpdateInput): Promise<Paiement>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=PaiementRepo.d.ts.map