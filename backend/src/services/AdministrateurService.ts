import { AdministrateurRepo } from "../repository/AdministrateurRepo";

export class AdministrateurService {
    private administrateurRepo: AdministrateurRepo;

    constructor() {
        this.administrateurRepo = new AdministrateurRepo();
    }

    getAllAdministrateurs() {
        return this.administrateurRepo.findAll();
    }

    getOneAdministrateur(id: number) {
        return this.administrateurRepo.findById(id);
    }

    createAdministrateur(data: any) {
        return this.administrateurRepo.create(data);
    }

    updateAdministrateur(id: number, data: any) {
        return this.administrateurRepo.update(id, data);
    }

    deleteAdministrateur(id: number) {
        return this.administrateurRepo.delete(id);
    }
}
