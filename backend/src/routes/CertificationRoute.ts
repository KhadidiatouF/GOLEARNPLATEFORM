import { Router } from "express";
import { CertificationController } from "../controllers/CertificationController";

const router = Router();

router.get("/", CertificationController.getAllCertifications);
router.get("/:id", CertificationController.getOneCertification);
router.post("/", CertificationController.createCertification);
router.delete("/:id", CertificationController.deleteCertification);

export default router;
