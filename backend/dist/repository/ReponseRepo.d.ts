import { Reponse } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class ReponseRepo implements IRepository<Reponse> {
    private prisma;
    findAll(page?: number, limit?: number): Promise<{
        data: Reponse[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    create(data: Omit<Reponse, "id">): Promise<Reponse>;
    update(id: number, data: Reponse): Promise<Reponse>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=ReponseRepo.d.ts.map