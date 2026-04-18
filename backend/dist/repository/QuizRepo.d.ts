import { Quiz } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class QuizRepo implements IRepository<Quiz> {
    private prisma;
    findAll(page?: number, limit?: number): Promise<{
        data: Quiz[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    findByFormationId(formationId: number): Promise<Quiz[]>;
    findBySessionId(sessionId: number): Promise<Quiz | null>;
    findByFormationIdWithDetails(formationId: number): Promise<any[]>;
    findFinalQuizByFormation(formationId: number): Promise<any | null>;
    updateScore(id: number, score: number): Promise<Quiz>;
    create(data: Omit<Quiz, "id">): Promise<Quiz>;
    update(id: number, data: Quiz): Promise<Quiz>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=QuizRepo.d.ts.map