import { Question } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class QuestionRepo implements IRepository<Question> {
    private prisma;
    findAll(page?: number, limit?: number): Promise<{
        data: Question[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    create(data: Omit<Question, "id">): Promise<Question>;
    update(id: number, data: Question): Promise<Question>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=QuestionRepo.d.ts.map