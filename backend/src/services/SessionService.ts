import { SessionRepo } from "../repository/SessionRepo";

export class SessionService {
    private sessionRepo: SessionRepo;

    constructor() {
        this.sessionRepo = new SessionRepo();
    }

    getAllSessions() {
        return this.sessionRepo.findAll();
    }

    getOneSession(id: number) {
        return this.sessionRepo.findById(id);
    }

    createSession(data: any) {
        return this.sessionRepo.create(data);
    }

    updateSession(id: number, data: any) {
        return this.sessionRepo.update(id, data);
    }

    deleteSession(id: number) {
        return this.sessionRepo.delete(id);
    }
}
