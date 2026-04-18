import { Utilisateur } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class UtilisateurRepo implements IRepository<Utilisateur> {
    private prisma;
    findAll(page?: number, limit?: number, role?: string, search?: string): Promise<{
        data: Utilisateur[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    findByLogin(login: string): Promise<any>;
    create(data: any): Promise<Utilisateur>;
    update(id: number, data: any): Promise<Utilisateur>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=UtilisateurRepo.d.ts.map