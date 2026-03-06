import { QuizRepo } from "../repository/QuizRepo";

export class QuizService {
    private quizRepo: QuizRepo;

    constructor() {
        this.quizRepo = new QuizRepo();
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
}
