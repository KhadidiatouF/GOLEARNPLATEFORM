import { QuizRepo } from "../repository/QuizRepo";
import { QuestionRepo } from "../repository/QuestionRepo";
import { Quiz, Question, Reponse } from "@prisma/client";

// Interface conform au modele Prisma Quiz
export interface QuizResult {
    id: number;
    score: number | null;
    totalQuestions: number;
    correctAnswers: number;
    isPassed: boolean;
}

// Interface conform au modele Prisma Quiz (pour le resume des quiz de modules)
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

export class QuizService {
    private quizRepo: QuizRepo;
    private questionRepo: QuestionRepo;

    // Seuil de validation (60%)
    private static readonly PASSING_THRESHOLD = 60;

    constructor() {
        this.quizRepo = new QuizRepo();
        this.questionRepo = new QuestionRepo();
    }

    getAllQuizzes() {
        return this.quizRepo.findAll();
    }

    getOneQuiz(id: number) {
        return this.quizRepo.findById(id);
    }

    createQuiz(data: any) {
        return this.quizRepo.create(data);
    }

    updateQuiz(id: number, data: any) {
        return this.quizRepo.update(id, data);
    }

    deleteQuiz(id: number) {
        return this.quizRepo.delete(id);
    }

    // ✅ Récupérer le quiz final d'une formation
    async getFinalQuiz(formationId: number) {
        return this.quizRepo.findFinalQuizByFormation(formationId);
    }

    /**
     * LOGIQUE MÉTIER: Calculer le résultat d'un quiz
     * 
     * @param quizId - ID du quiz
     * @param answers - Objet contenant les réponses de l'apprenant { questionId: reponseId }
     * @returns Le résultat du quiz avec le score
     */
    async submitQuiz(quizId: number, answers: Record<number, number>): Promise<QuizResult> {
        const quiz = await this.quizRepo.findById(quizId);
        
        if (!quiz) {
            throw new Error("Quiz non trouvé");
        }

        const questions = quiz.questions;
        let correctAnswers = 0;
        const totalQuestions = questions.length;

        // Calculer les réponses correctes
        for (const question of questions) {
            const userAnswerId = answers[question.id];
            if (userAnswerId) {
                const selectedResponse = question.reponses.find((r: any) => r.id === userAnswerId);
                if (selectedResponse && selectedResponse.estCorrecte) {
                    correctAnswers++;
                }
            }
        }

        // Calculer le score en pourcentage
        const score = totalQuestions > 0 
            ? Math.round((correctAnswers / totalQuestions) * 100) 
            : 0;

        // Sauvegarder le score dans la base de données
        await this.quizRepo.updateScore(quizId, score);

        return {
            id: quizId,
            score,
            totalQuestions,
            correctAnswers,
            isPassed: score >= QuizService.PASSING_THRESHOLD
        };
    }

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
    async checkCanTakeFinalQuiz(formationId: number): Promise<CanTakeFinalQuizResult> {
        const quizzes = await this.quizRepo.findByFormationIdWithDetails(formationId);
        
        const moduleQuizzes: ModuleQuizSummary[] = quizzes.map(quiz => ({
            id: quiz.id,
            sessionId: quiz.sessionId,
            score: quiz.score,
            isPassed: quiz.score !== null && quiz.score >= QuizService.PASSING_THRESHOLD
        }));

        // Calculer la moyenne des quiz qui ont un score
        const scoredQuizzes = moduleQuizzes.filter(q => q.score !== null);
        const averageScore = scoredQuizzes.length > 0
            ? scoredQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / scoredQuizzes.length
            : 0;

        // Compter les quiz échoués
        const failedQuizzes = scoredQuizzes.filter(q => !q.isPassed).length;

        // L'apprenant peut passer le quiz final si:
        // - Il n'a pas de quiz échoué (score < 60%)
        // - ET la moyenne est >= 60%
        const canTakeFinal = failedQuizzes === 0 && averageScore >= QuizService.PASSING_THRESHOLD;

        return {
            canTakeFinal,
            moduleQuizzes,
            averageScore: Math.round(averageScore),
            failedQuizzes
        };
    }

    /**
     * LOGIQUE MÉTIER: Obtenir le résumé des quiz d'une formation pour un apprenant
     * 
     * @param formationId - ID de la formation
     * @returns Résumé des quiz avec les scores et statut de validation
     */
    async getQuizSummary(formationId: number) {
        return this.checkCanTakeFinalQuiz(formationId);
    }
}
