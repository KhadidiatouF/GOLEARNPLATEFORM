import { PaiementRepo } from "../repository/PaiementRepo";

export class PaiementService {
    private paiementRepo: PaiementRepo;

    constructor() {
        this.paiementRepo = new PaiementRepo();
    }

    getAllPaiements() {
        return this.paiementRepo.findAll();
    }

    getOnePaiement(id: number) {
        return this.paiementRepo.findById(id);
    }

    createPaiement(data: any) {
        return this.paiementRepo.create(data);
    }

    updatePaiement(id: number, data: any) {
        return this.paiementRepo.update(id, data);
    }

    deletePaiement(id: number) {
        return this.paiementRepo.delete(id);
    }
}
