import { CertificationRepo } from "../repository/CertificationRepo";

export class CertificationService {
    private certificationRepo: CertificationRepo;

    constructor() {
        this.certificationRepo = new CertificationRepo();
    }

    getAllCertifications() {
        return this.certificationRepo.findAll();
    }

    getOneCertification(id: number) {
        return this.certificationRepo.findById(id);
    }

    createCertification(data: any) {
        return this.certificationRepo.create(data);
    }

    updateCertification(id: number, data: any) {
        return this.certificationRepo.update(id, data);
    }

    deleteCertification(id: number) {
        return this.certificationRepo.delete(id);
    }
}
