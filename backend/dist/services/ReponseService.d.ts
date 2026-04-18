export declare class ReponseService {
    private reponseRepo;
    constructor();
    getAllReponses(): Promise<{
        data: import("@prisma/client").Reponse[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneReponse(id: number): Promise<any>;
    createReponse(data: any): Promise<{
        id: number;
        contenu: string;
        estCorrecte: boolean;
        questionId: number;
    }>;
    updateReponse(id: number, data: any): Promise<{
        id: number;
        contenu: string;
        estCorrecte: boolean;
        questionId: number;
    }>;
    deleteReponse(id: number): Promise<void>;
}
//# sourceMappingURL=ReponseService.d.ts.map