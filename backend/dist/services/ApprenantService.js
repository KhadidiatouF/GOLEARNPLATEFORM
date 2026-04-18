"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprenantService = void 0;
const ApprenantRepo_1 = require("../repository/ApprenantRepo");
class ApprenantService {
    apprenantRepo;
    constructor() {
        this.apprenantRepo = new ApprenantRepo_1.ApprenantRepo();
    }
    getAllApprenants() {
        return this.apprenantRepo.findAll();
    }
    getOneApprenant(id) {
        return this.apprenantRepo.findById(id);
    }
    createApprenant(data) {
        return this.apprenantRepo.create(data);
    }
    updateApprenant(id, data) {
        return this.apprenantRepo.update(id, data);
    }
    deleteApprenant(id) {
        return this.apprenantRepo.delete(id);
    }
}
exports.ApprenantService = ApprenantService;
//# sourceMappingURL=ApprenantService.js.map