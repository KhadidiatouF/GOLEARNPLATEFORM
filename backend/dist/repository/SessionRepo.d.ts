import { Session } from "@prisma/client";
import { IRepository } from "./IRepository";
export declare class SessionRepo implements IRepository<Session> {
    private prisma;
    findAll(page?: number, limit?: number): Promise<{
        data: Session[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<any>;
    create(data: Omit<Session, "id">): Promise<Session>;
    update(id: number, data: Session): Promise<Session>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=SessionRepo.d.ts.map