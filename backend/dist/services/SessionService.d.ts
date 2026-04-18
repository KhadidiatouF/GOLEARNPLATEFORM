export declare class SessionService {
    private sessionRepo;
    constructor();
    getAllSessions(): Promise<{
        data: import("@prisma/client").Session[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneSession(id: number): Promise<any>;
    createSession(data: any): Promise<{
        id: number;
        formationId: number;
        titre: string;
        contenu: string | null;
        duree: string;
    }>;
    updateSession(id: number, data: any): Promise<{
        id: number;
        formationId: number;
        titre: string;
        contenu: string | null;
        duree: string;
    }>;
    deleteSession(id: number): Promise<void>;
}
//# sourceMappingURL=SessionService.d.ts.map