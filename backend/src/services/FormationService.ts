import { FormationRepo } from "../repository/FormationRepo";

export class FormationService {
    private formationRepo: FormationRepo;

    constructor() {
        this.formationRepo = new FormationRepo();
    }

    getAllFormations() {
        return this.formationRepo.findAll();
    }

    getOneFormation(id: number) {
        return this.formationRepo.findById(id);
    }

    createFormation(data: any) {
        return this.formationRepo.create(data);
    }

    updateFormation(id: number, data: any) {
        return this.formationRepo.update(id, data);
    }

    deleteFormation(id: number) {
        return this.formationRepo.delete(id);
    }
}
