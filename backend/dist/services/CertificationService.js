"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationService = void 0;
const CertificationRepo_1 = require("../repository/CertificationRepo");
class CertificationService {
    certificationRepo;
    constructor() {
        this.certificationRepo = new CertificationRepo_1.CertificationRepo();
    }
    getAllCertifications(apprenantId) {
        return this.certificationRepo.findAll(1, 100, apprenantId);
    }
    getCertificationsByApprenantId(apprenantId) {
        return this.certificationRepo.findAll(1, 100, apprenantId);
    }
    getOneCertification(id) {
        return this.certificationRepo.findById(id);
    }
    createCertification(data) {
        return this.certificationRepo.create(data);
    }
    async createCertificationIfMissing(apprenantId, formationId) {
        const existingCertification = await this.certificationRepo.findByApprenantAndFormation(apprenantId, formationId);
        if (existingCertification) {
            return existingCertification;
        }
        return this.certificationRepo.create({ apprenantId, formationId, dateObtention: new Date() });
    }
    updateCertification(id, data) {
        return this.certificationRepo.update(id, data);
    }
    deleteCertification(id) {
        return this.certificationRepo.delete(id);
    }
}
exports.CertificationService = CertificationService;
//# sourceMappingURL=CertificationService.js.map