import { Quiz } from "@prisma/client";
export interface QuizResult {
    id: number;
    score: number | null;
    totalQuestions: number;
    correctAnswers: number;
    isPassed: boolean;
}
export interface ModuleQuizSummary {
    id: number;
    sessionId: number;
    score: number | null;
    isPassed: boolean;
}
export interface CanTakeFinalQuizResult {
    canTakeFinal: boolean;
    moduleQuizzes: ModuleQuizSummary[];
    averageScore: number;
    failedQuizzes: number;
}
export declare class QuizService {
    private quizRepo;
    private questionRepo;
    private static readonly PASSING_THRESHOLD;
    constructor();
    getAllQuizzes(): Promise<{
        data: Quiz[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneQuiz(id: number): Promise<any>;
    createQuiz(data: any): Promise<{
        type: import("@prisma/client").$Enums.TypeQuiz;
        id: number;
        formationId: number;
        score: number | null;
        sessionId: number | null;
    }>;
    updateQuiz(id: number, data: any): Promise<{
        type: import("@prisma/client").$Enums.TypeQuiz;
        id: number;
        formationId: number;
        score: number | null;
        sessionId: number | null;
    }>;
    deleteQuiz(id: number): Promise<void>;
    getFinalQuiz(formationId: number): Promise<any>;
    /**
     * LOGIQUE MÉTIER: Calculer le résultat d'un quiz
     *
     * @param quizId - ID du quiz
     * @param answers - Objet contenant les réponses de l'apprenant { questionId: reponseId }
     * @returns Le résultat du quiz avec le score
     */
    submitQuiz(quizId: number, answers: Record<number, number>): Promise<QuizResult>;
    /**
     * LOGIQUE MÉTIER: Vérifier si l'apprenant peut passer le quiz final
     *
     * Pour pouvoir passer le quiz final (certification):
     * - Tous les quiz de modules doivent avoir un score >= 60%
     * - OU la moyenne des quiz de modules doit être >= 60%
     *
     * @param formationId - ID de la formation
     * @returns Si l'apprenant peut passer le quiz final
     */
    checkCanTakeFinalQuiz(formationId: number): Promise<CanTakeFinalQuizResult>;
    /**
     * LOGIQUE MÉTIER: Obtenir le résumé des quiz d'une formation pour un apprenant
     *
     * @param formationId - ID de la formation
     * @returns Résumé des quiz avec les scores et statut de validation
     */
    getQuizSummary(formationId: number): Promise<CanTakeFinalQuizResult>;
}
//# sourceMappingURL=QuizService.d.ts.map