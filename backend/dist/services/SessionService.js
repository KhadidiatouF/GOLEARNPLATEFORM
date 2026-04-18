"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const SessionRepo_1 = require("../repository/SessionRepo");
class SessionService {
    sessionRepo;
    constructor() {
        this.sessionRepo = new SessionRepo_1.SessionRepo();
    }
    getAllSessions() {
        return this.sessionRepo.findAll();
    }
    getOneSession(id) {
        return this.sessionRepo.findById(id);
    }
    createSession(data) {
        return this.sessionRepo.create(data);
    }
    updateSession(id, data) {
        return this.sessionRepo.update(id, data);
    }
    deleteSession(id) {
        return this.sessionRepo.delete(id);
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map