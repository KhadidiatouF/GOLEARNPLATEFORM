import { CertificationRepo } from "../repository/CertificationRepo";

export class CertificationService {
    private certificationRepo: CertificationRepo;

    constructor() {
        this.certificationRepo = new CertificationRepo();
    }

    getAllCertifications(apprenantId?: number) {
        return this.certificationRepo.findAll(1, 100, apprenantId);
    }

    getCertificationsByApprenantId(apprenantId: number) {
        return this.certificationRepo.findAll(1, 100, apprenantId);
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
