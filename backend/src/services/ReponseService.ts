import { ReponseRepo } from "../repository/ReponseRepo";

export class ReponseService {
    private reponseRepo: ReponseRepo;

    constructor() {
        this.reponseRepo = new ReponseRepo();
    }

    getAllReponses() {
        return this.reponseRepo.findAll();
    }

    getOneReponse(id: number) {
        return this.reponseRepo.findById(id);
    }

    createReponse(data: any) {
        return this.reponseRepo.create(data);
    }

    updateReponse(id: number, data: any) {
        return this.reponseRepo.update(id, data);
    }

    deleteReponse(id: number) {
        return this.reponseRepo.delete(id);
    }
}
