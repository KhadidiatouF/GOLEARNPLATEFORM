"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const QuestionRepo_1 = require("../repository/QuestionRepo");
class QuestionService {
    questionRepo;
    constructor() {
        this.questionRepo = new QuestionRepo_1.QuestionRepo();
    }
    getAllQuestions() {
        return this.questionRepo.findAll();
    }
    getOneQuestion(id) {
        return this.questionRepo.findById(id);
    }
    createQuestion(data) {
        return this.questionRepo.create(data);
    }
    updateQuestion(id, data) {
        return this.questionRepo.update(id, data);
    }
    deleteQuestion(id) {
        return this.questionRepo.delete(id);
    }
}
exports.QuestionService = QuestionService;
//# sourceMappingURL=QuestionService.js.map