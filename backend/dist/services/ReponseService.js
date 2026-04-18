"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReponseService = void 0;
const ReponseRepo_1 = require("../repository/ReponseRepo");
class ReponseService {
    reponseRepo;
    constructor() {
        this.reponseRepo = new ReponseRepo_1.ReponseRepo();
    }
    getAllReponses() {
        return this.reponseRepo.findAll();
    }
    getOneReponse(id) {
        return this.reponseRepo.findById(id);
    }
    createReponse(data) {
        return this.reponseRepo.create(data);
    }
    updateReponse(id, data) {
        return this.reponseRepo.update(id, data);
    }
    deleteReponse(id) {
        return this.reponseRepo.delete(id);
    }
}
exports.ReponseService = ReponseService;
//# sourceMappingURL=ReponseService.js.map