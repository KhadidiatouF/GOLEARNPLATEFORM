import { QuestionRepo } from "../repository/QuestionRepo";

export class QuestionService {
    private questionRepo: QuestionRepo;

    constructor() {
        this.questionRepo = new QuestionRepo();
    }

    getAllQuestions() {
        return this.questionRepo.findAll();
    }

    getOneQuestion(id: number) {
        return this.questionRepo.findById(id);
    }

    createQuestion(data: any) {
        return this.questionRepo.create(data);
    }

    updateQuestion(id: number, data: any) {
        return this.questionRepo.update(id, data);
    }

    deleteQuestion(id: number) {
        return this.questionRepo.delete(id);
    }
}
