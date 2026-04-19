export interface QuizCoachQuestionInput {
    question: string;
    options: string[];
    selectedIndex: number;
    correctIndex: number;
}
export interface QuizCoachRequest {
    formationTitle?: string;
    sessionTitle?: string;
    score: number;
    requiredScore: number;
    attemptCount: number;
    questions: QuizCoachQuestionInput[];
}
export interface QuizCoachResponse {
    coachName: string;
    message: string;
    usedAI: boolean;
}
export declare class QuizCoachService {
    private static readonly COACH_NAME;
    generateFeedback(payload: QuizCoachRequest): Promise<QuizCoachResponse>;
    private generateWithOpenAI;
    private generateFallbackFeedback;
}
//# sourceMappingURL=QuizCoachService.d.ts.map