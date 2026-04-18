import { Professeur } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class ProfesseurRepo implements IRepository<Professeur> {
    private prisma;
    findAll(page?: number, limit?: number): Promise<{
        data: Professeur[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    findByUtilisateurId(utilisateurId: number): Promise<Professeur | null>;
    create(data: Omit<Professeur, "id">): Promise<Professeur>;
    update(id: number, data: Partial<Professeur>): Promise<Professeur>;
    delete(id: number): Promise<void>;
    findByStatut(statut: string): Promise<Professeur[]>;
    updateStatut(id: number, statut: string): Promise<Professeur>;
}
//# sourceMappingURL=ProfesseurRepo.d.ts.map