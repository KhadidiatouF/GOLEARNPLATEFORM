export declare class QuestionService {
    private questionRepo;
    constructor();
    getAllQuestions(): Promise<{
        data: import("@prisma/client").Question[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneQuestion(id: number): Promise<any>;
    createQuestion(data: any): Promise<{
        id: number;
        contenu: string;
        quizId: number;
    }>;
    updateQuestion(id: number, data: any): Promise<{
        id: number;
        contenu: string;
        quizId: number;
    }>;
    deleteQuestion(id: number): Promise<void>;
}
//# sourceMappingURL=QuestionService.d.ts.map