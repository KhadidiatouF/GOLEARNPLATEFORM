import { Router } from "express";
import { CertificationController } from "../controllers/CertificationController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/admin/all", authenticate, CertificationController.getAdminCertifications);
router.get("/professeur/mine", authenticate, CertificationController.getProfessorCertifications);
router.get("/", authenticate, CertificationController.getAllCertifications);
router.get("/:id", authenticate, CertificationController.getOneCertification);
router.post("/", authenticate, CertificationController.createCertification);
router.delete("/:id", authenticate, CertificationController.deleteCertification);

export default router;
