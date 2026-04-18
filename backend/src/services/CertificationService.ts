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

    async createCertificationIfMissing(apprenantId: number, formationId: number) {
        const existingCertification = await this.certificationRepo.findByApprenantAndFormation(apprenantId, formationId);
        if (existingCertification) {
            return existingCertification;
        }

        return this.certificationRepo.create({ apprenantId, formationId, dateObtention: new Date() });
    }

    updateCertification(id: number, data: any) {
        return this.certificationRepo.update(id, data);
    }

    deleteCertification(id: number) {
        return this.certificationRepo.delete(id);
    }
}
