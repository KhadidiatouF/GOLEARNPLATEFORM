import { Administrateur } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class AdministrateurRepo implements IRepository<Administrateur> {
    private prisma;
    findAll(page?: number, limit?: number): Promise<{
        data: Administrateur[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    create(data: Omit<Administrateur, "id">): Promise<Administrateur>;
    update(id: number, data: Administrateur): Promise<Administrateur>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=AdministrateurRepo.d.ts.map